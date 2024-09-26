// import all product modules
const Product = require('../models/Product');
const Variants = require('../models/Variants');
const Catelog = require('../models/Catalogs');
const cloudinary = require('../Config/Cloudinary');
const UserActivity = require('../models/UserActivity');
const ProductSerice = require('../models/ProductSerice');
const OTP_Generator = require('otp-generator');
const MailSender = require('../Utile/MailSender');
const Supplier = require('../models/Supplier');
const Location = require('../models/Locations');
const SallesOrderDetails = require('../models/SallerOrderDetails');
const CatalogName = require('../models/Catalogs')
    // const imageUploder = require('../Utile/ImageUploder');


// creat brand on sales manager
exports.Product = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;
        const Id = req.user.id;
        // fetch data in request body
        const { CreatedOn, Brand } = req.body;

        // chack all data are full failed or not 
        if (!CreatedOn || !Brand) {
            return res.status(401).json({
                success: false,
                message: "full fail all request"
            })
        }

        const productAcronym = OTP_Generator.generate(12, { specialChars: false });

        // chack the brand name are all ready present or not
        const chackBrand = await Product.findOne({ Brand: Brand });
        if (chackBrand) {
            return res.status(402).json({
                success: false,
                message: "all ready present brand name",
            })
        }

        // image upload in cloudinary

        let image = "";
        await cloudinary.uploader.upload(req.file.path, function(err, result) {

            if (err) {
                console.log(err);
                return res.status(400).json({
                    success: false,
                    message: "image upload failed",
                })
            }
            image = result.secure_url;

        })

        // Send mail  user mail
        try {
            const FindUser = await UserActivity.findById({ _id: Id });
            const MailSend = await MailSender(FindUser.Email, "Acronym ID ", productAcronym);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "failed mail send ",
            })

        }

        // save entry in your database
        const creatingBrand = await Product.create({
            location_ID: location_ID,
            CreatedOn: CreatedOn,
            productAcronym: productAcronym,
            Brand: Brand,
            Image: image,

        })


        // find by brand name ,to insert brand id
        // const brand_ID = await Product.findOne({ Brand: Brand });


        // update useractivty to insert brand id
        const UpdateUserActivation = await UserActivity.findByIdAndUpdate({ _id: Id }, { Product_ID: creatingBrand._id }, { new: true }).populate('Product_ID').exec();

        console.log("five");
        // return success responce 
        return res.status(201).json({
            success: true,
            message: `your entry save success fully`,
            UpdateUserActivation,

        })

    } catch (error) {
        console.log("error in product controller");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `error in product controller :- ${error} `,
        })
    }
}

// create catelog for sailer
exports.CatelogController = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;
        const Id = req.user.id;

        // chack user are all ready creat catlog
        const productCatlog = await UserActivity.findById({ _id: Id });
        if (productCatlog.catalog_ID) {
            return res.status(403).json({
                success: false,
                message: `your catalog all ready created : ${productCatlog.catalog_ID}`,
            })
        }

        // fetch data for request body
        const { CatalogName } = req.body;
        // chack full fill all request
        if (!CatalogName) {
            return res.status(401).json({
                success: false,
                message: "full fail all request"
            })
        }

        // upload image in cloudinary
        let image = "";
        await cloudinary.uploader.upload(req.file.path, function(err, result) {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    success: false,
                    message: "image upload failed",
                })
            }
            image = result.secure_url;

        })

        // save the entry
        const saveEntry = await Catelog.create({
            location_ID: location_ID,
            CreatedOn: Date.now(),
            CatalogName: CatalogName,
            Image: image
        })

        // update UserActivity module
        const updateProduct = await UserActivity.findByIdAndUpdate({ _id: Id }, { catalog_ID: saveEntry._id });
        return res.status(200).json({
            success: true,
            message: `your Catlog created success fully : ${updateProduct}`,
        })




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/CatelogController) "
        })
    }
}

// create serice name for your own brand 
exports.Product_Serice_Controller = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;
        const Id = req.user.id;

        // fetch data for request body
        const { SericeName } = req.body;
        // chack full fill all request
        if (!SericeName) {
            return res.status(401).json({
                success: false,
                message: "full fail all request"
            })
        }

        // chack user request serice all ready present or not
        const chackSerice = await ProductSerice.findOne({ SericeName: SericeName });

        if (chackSerice) {
            return res.status(403).json({
                success: false,
                message: "this name serice are all ready present"
            })
        }

        // save user entry
        const SaveData = await ProductSerice.create({
            SericeName: SericeName,
            Location_ID: location_ID
        })

        // update product
        const FindUserActivation = await UserActivity.findById({ _id: Id });
        const UpdateProduct = await Product.findByIdAndUpdate({ _id: FindUserActivation.Product_ID }, {
            $push: {
                product_serice: SaveData._id
            }
        }, { new: true }).populate('product_serice').exec();

        // seccess responce 
        return res.status(200).json({
            success: true,
            message: `your product serice created success fully : ${SaveData }`,
            UpdateProduct
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/Product_Serice_Controller) "
        })
    }
}

// create itme 
exports.ProductVariantsController = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;
        const Id = req.user.id;

        //fetch data for request body 
        const { ItmeName, Vendor_SUK, TypeColour, Size, SUK, UOM, PurchasePrice, ListPrice, StorageLocation, ProductSericeName } = req.body;


        // chack all data full field or not
        if (!ItmeName || !Vendor_SUK || !TypeColour || !Size || !SUK || !UOM || !PurchasePrice || !ListPrice || !StorageLocation || !ProductSericeName) {
            return res.status(401).json({
                success: false,
                message: "full fail all request"
            })
        }
        // chack itme name all ready present or not
        const chackName = await Variants.findOne({ ItmeName: ItmeName });
        if (chackName) {
            return res.status(401).json({
                success: false,
                message: "all ready itme present in this name"
            })
        }

        // creat variable to store

        let productId;
        let findSerice;
        let findSupplier;
        let serice_Id_Is;
        let FindProductId;


        // find BY Location for seller
        const userState = await Location.findById({ _id: location_ID });

        // find BY Location for supplier to present in saller state
        findSupplier = await Supplier.findOne({ State: userState.state });

        // chack seller is present or not
        if (!findSupplier) {
            console.log('supplier id are not present', findSupplier);
            return res.status(400).json({
                success: false,

                message: 'supplier not present'
            })
        }

        // find product Id
        FindProductId = await UserActivity.findById({ _id: Id });
        productId = FindProductId.Product_ID;

        // find brand for sales man to chack brand serice name
        const productSericeID = await Product.findById({ _id: productId });

        // chack serice name are all ready present or not
        findSerice = await (productSericeID.product_serice);

        findSerice.map(async(data) => {

            let chack = await ProductSerice.findById({ _id: data });
            if (chack.SericeName == ProductSericeName) {

                serice_Id_Is = chack._id;
            }
        })

        // chack serice id are present or not
        if (!serice_Id_Is) {
            return res.status(400).json({
                success: false,
                message: "id not found",
            })
        }



        // upload image
        let imageUrl;
        try {
            // image upload in cloudinary

            await cloudinary.uploader.upload(req.file.path, function(err, result) {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        success: false,
                        message: "image upload failed",
                    })
                }
                imageUrl = result.secure_url;

            })



        } catch (error) {
            return res.status(500).json({
                success: false,
                message: " sumthing wrong in uploading image "
            })

        }




        // save data
        const creatVarient = await Variants.create({
            location_ID: location_ID,
            CreatedOn: Date.now(),
            Product_ID: productId,
            ProductSerice_ID: serice_Id_Is,
            ItmeImage: imageUrl,
            ItmeName: ItmeName,
            Vendor_SUK: Vendor_SUK,
            TypeColour: TypeColour,
            Size: Size,
            SUK: SUK,
            UOM: UOM,
            Supplier_ID: findSupplier._id,
            Catalogs_ID: FindProductId.catalog_ID,
            PurchasePrice: PurchasePrice,
            ListPrice: ListPrice,
            StorageLocation: StorageLocation,
        })

        return res.status(200).json({
            success: true,
            message: "success fully create product",
            creatVarient
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/ProductVariantsController) "
        })
    }
}

// create Upcomming order page
exports.UpcommingOrderController = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;
        const { Name } = req.body;
        if (!Name) {
            return res.status(404).json({
                success: false,
                message: "full filled all request",
            })
        }

        // creat upcomming controller
        const SaveEntry = await SallesOrderDetails.create({
            location_ID: location_ID,
            Name: Name,
        })

        return res.status(200).json({
            success: true,
            message: "success fully save entry",
            SaveEntry
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/UpcommingOrderController) "
        })

    }
}

// show all order 
exports.AllOrderControler = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;

        const showAllOrder = await SallesOrderDetails.findOne({ location_ID: location_ID }).populate("UpcommingOrder");

        return res.status(200).json({
            success: true,
            message: "success fully save entry",
            showAllOrder,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/llOrderControler) "
        })


    }
}

// show all serice 

exports.AllSericeControler = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;
        const Id = req.user.id;

        const findProduct = await UserActivity.findById({ _id: Id });
        const FindProduct = await Product.findById({ _id: findProduct.Product_ID }).populate('product_serice').exec();
        return res.status(200).json({
            success: true,
            massage: "success fully find product serice",
            FindProduct
        })




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/llOrderControler) "
        })


    }
}

// see all itme 
exports.AllItmeFindController = async(req, res) => {
    try {
        const allProduct = await Variants.find();
        return res.status(200).json({
            success: true,
            message: "success fully find all product",
            allProduct
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/AllItmeFindController) "
        })
    }
}

// saler see all item for your own brand 
exports.SellerSeeAllItme = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;
        const FindProductSerice = await ProductSerice.find({ Location_ID: location_ID })
            .populate(' Variant_ID').exec();
        return res.status(200).json({
            success: true,
            massage: "success fully find all serice",
            FindProductSerice
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/AllItmeFindController) "
        })

    }
}

// find single itme and there all detailes

exports.FindSingleItme = async(req, res) => {
    try {
        const { VariantID } = req.body;

        // find by product is and populate brand and serice
        const FindProductVarient = await Variants.findById({ _id: VariantID }).populate('Product_ID').populate('ProductSerice_ID').exec();

        // success responce
        return res.status(200).json({
            success: true,
            message: "success fully find all details for product ",
            FindProductVarient
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/FindSingleItme) "
        })
    }
}

// show all itme in enter UOM ID
exports.ShowAllItmeUsing_UOM_ID = async(req, res) => {
    try {
        // fetch data for request body 
        const { UOM } = req.body;

        // search in your own data dase
        const findVarient = await Variants.find({ UOM: UOM });

        // return res 
        return res.status(200).json({
            success: true,
            message: "success fully find all itme",
            findVarient
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/ShowAllItmeUsing_UOM_ID) "
        })
    }
}

// show all itme
exports.ShowAllItme = async(req, res) => {
    try {
        const AllItme = await Variants.find();
        return res.status(200).json({
            success: true,
            message: "success fully fetch all itme",
            AllItme

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/ShowAllItme) "
        })

    }
}

// show all itme with brand detailes 
exports.ShowAllItemWithBrandDetailes = async(req, res) => {
    try {
        const AllItems = await Variants.find().populate('Product_ID').populate('ProductSerice_ID').exec();
        return res.status.json({
            success: true,
            message: "success fully fetch all items"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/ShowAllItemWithBrandDetailes) "
        })
    }
}

exports.ShowAllBrand = async(req, res) => {
    try {
        const showAllBrand = await Product.find({});
        return res.status(200).json({
            success: true,
            message: "all brand name are fetch",
            showAllBrand
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/ShowAllBrand ) "
        })
    }
}

exports.ShowCatelog = async(req, res) => {
    try {
        const { Location_ID } = req.body;

        const FindCateLog = await CatalogName.findOne({ location_ID: Location_ID })
        if (!FindCateLog) {
            return res.status(401).json({
                success: false,
                message: "Catelog are not find"
            })
        }
        return res.status(200).json({
            success: true,
            message: "catelog find success fully",
            FindCateLog
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/ShowCatelog) "
        })

    }
}
exports.SearchingProduct = async(req, res) => {
    try {
        const { UOM } = req.body;
        const Uom = UOM.toUpperCase();

        const FindProduct = await Variants.find({ UOM: Uom });

        return res.status(200).json({
            success: true,
            message: "find success fully",
            FindProduct
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/SearchingProduct) "
        })
    }
}

exports.showUserOrder = async(req, res) => {
    try {
        // const location_ID = req.user.Location_ID;
        const Id = req.user.id;
        const UserOrder = await UserActivity.findById({ _id: Id }).populate("PurchaseOrder").exec();
        return res.status(200).json({
            success: true,
            message: "that your order",
            UserOrder
        })


    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "opps sorry plece try again let a (controller/productManager/SearchingProduct) "
        })
    }

}