const Supplier = require('../models/Supplier');
const Location = require('../models/Locations');
const stockTransfer = require('../models/StockTransfer');
const OTP_Generator = require('otp-generator');
const PO = require('../models/PO');
const MailSender = require('../Utile/MailSender');
const Variants = require('../models/Variants');
const PO_Lines = require('../models/PoLines');
const SallerOderDetails = require('../models/SallerOrderDetails');
const SalesOrder = require('../models/SalesOrder');
const SalesOrderLine = require('../models/SalesOrderLine');
const SalesInvoice = require('../models/Invoice');
const UserActivity = require('../models/UserActivity');
const SuperUser = require('../models/SuperUser');
const PaymentGitwaya = require('../models/PaymentGitwaya');
const InventoryManagement = require('../models/InventoryManagement');




exports.SupplierController = async(req, res) => {
    try {


        const Id = req.user.id;
        const Email = req.user.email;

        // fetch data for user body
        const { SupplierName, ContactPerson, ContactTitle, ContactEmail, PhoneNo, CityNo, State, Cauntry, Address, LicenseNum, PaymentMethod, PaymentTerms, location_ID, ActioneType } = req.body;

        // chack full filed all request

        if (!SupplierName || !ContactPerson || !ContactTitle || !ContactEmail || !PhoneNo || !CityNo || !State || !Cauntry || !Address || !LicenseNum || !PaymentMethod || !PaymentTerms) {
            return res.status(401).json({
                success: false,
                message: "full fail all request"
            })
        }

        //  chack supplier are all ready present in this state
        const chackState = await Supplier.findOne({ State: State });
        if (chackState) {
            return res.status(403).json({
                success: false,
                message: "supplier all ready present in this state "

            })
        }
        // chack email id
        const chackEmailAndPhoneNo = await Supplier.findOne({ ContactEmail: ContactEmail }) || await Supplier.findOne({ PhoneNo: PhoneNo });

        if (chackEmailAndPhoneNo) {
            return res.status(403).json({
                success: false,
                message: "change email or phoneNoall ready  "

            })
        }
        // update UserActiovation
        const UserActivation = await UserActivity.findOneAndUpdate({ Location_ID: location_ID }, {
                ActioneType: ActioneType
            }, { new: true })
            // Update Super UserProfile 
        const UpdateSuperUserProfile = await SuperUser.findOneAndUpdate({ email: Email }, {
                $push: { LicenseNumber: LicenseNum }
            }, { new: true })
            // create new supplier..
        const SaveEntry = await Supplier.create({
            location_ID: location_ID,
            CreatedOn: Date.now(),
            SupplierName: SupplierName,
            ContactPerson: ContactPerson,
            ContactTitle: ContactTitle,
            ContactEmail: ContactEmail,
            PhoneNo: PhoneNo,
            CityNo: CityNo,
            State: State,
            Cauntry: Cauntry,
            Address: Address,
            LicenseNum: LicenseNum,
            PaymentMethod: PaymentMethod,
            PaymentTerms: PaymentTerms,
        })

        return res.status(201).json({
            success: true,
            message: "success fully create supplier id"
        })



    } catch (error) {
        console.log("error in Supplier controller");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `error in Supplier controller :- ${error} `,
        })
    }
}


// Update stock transfer

exports.stockTransferUpdateController = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;
        const Id = req.user.id;
        // const FindSupplierAccount = await Supplier.findById({ _id: Id });

        const { Po_LineID, LOC, CC, TransferQTY } = req.body;
        if (!Po_LineID || !LOC || !CC || !TransferQTY) {
            return res.status(401).json({
                success: false,
                message: "full fail all request"
            })
        }

        const ProductSeftToInventory = await PO_Lines.findById({ _id: Po_LineID });

        const CustromerItmeTransfer = await stockTransfer.findByIdAndUpdate({ _id: ProductSeftToInventory.StockTransfer_ID }, {
            TransferByLOC: LOC,
            TransferByCC: CC,
            TransferQTY: TransferQTY,
            Status: "request for custromer state"
        }, { new: true });

        const FindCustromerState = await Location.findById({ _id: ProductSeftToInventory.location_ID });



        const StockTransferForCustromerState = await stockTransfer.create({
            location_ID: location_ID,
            CreatedOn: Date.now(),
            TransferByLOC: LOC,
            TransferByCC: CC,
            TransferQTY: TransferQTY,
        })

        const SupplierForCustromerState = await Supplier.findOneAndUpdate({ State: FindCustromerState.state }, {
            $push: {
                UpcomminOrderToState: StockTransferForCustromerState._id,
            }
        }, { new: true });
        //

        return res.status(200).json({
            success: true,
            messager: "success fully update custromer product",
            SupplierForCustromerState
        })

    } catch (error) {
        console.log("error in Stock transfer  Update controller");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `stock Transfer Update Controller :- ${error} `,
        })

    }
}

// show all Upcomming Stock
exports.ShowUpcommingStock = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;
        const Id = req.user.id;

        const FindSupplierAccount = await Supplier.findOne({ location_ID: location_ID }).populate('UpcomminOrderToState').exec();

        return res.status(200).json({
            success: true,
            message: "all Upcoming order ,find success fully ",
            FindSupplierAccount
        })


    } catch (error) {
        console.log("error in Stock execept or cancel ");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `stock execept or cancel:- ${error} `,
        })
    }
}


// execept Upcomming stock 
exports.ExceptUpcommingStock = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;
        const Id = req.user.id;
        const { StockStransferId, PoLineId, LOC, CC } = req.body;

        const FindId = await stockTransfer.findByIdAndUpdate({ _id: StockStransferId }, {
            TransferToLOC: LOC,
            TransferToCC: CC,
            Status: 'execept'

        }, { new: true })


        const FindSupplierAndUpdate = await Supplier.findOneAndUpdate({ location_ID: FindId.location_ID }, {
            $push: {
                SendProduct: FindId._id,
            },
            $pull: {
                StockTransfer: StockStransferId,
                PO_Lines: PoLineId
            }
        }, { new: true });


        const SupplierForCustromerState = await Supplier.findOneAndUpdate({ location_ID: location_ID }, {
            $pull: {
                UpcomminOrderToState: StockStransferId,
            },
            $push: {
                UpcommingProduct: StockStransferId,
            }
        }, { new: true });
        // const SupplierAndDelete = await Supplier.findOneAndDelete({ location_ID: FindId.location_ID }, {
        //     SendProduct: FindId._id,
        // }, { new: true });


        return res.status(201).json({
            success: true,
            message: "success fully update order",

        })




    } catch (error) {
        console.log("error in Stock execept or cancel ");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `stock execept or cancel:- ${error} `,
        })
    }
}


// product order liens
exports.PurchaseOrderLines = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;

        const { ItemName, Size = "", SKU, UOM, OrderQTY, OrderType, LOC, CC, PaymentId } = req.body;

        if (!ItemName || !SKU || !UOM || !OrderQTY || !LOC || !CC || !OrderType || !PaymentId) {
            return res.status(401).json({
                success: false,
                message: "full fail all request"
            })
        }



        const FindProduct = await Variants.findOne({ ItmeName: ItemName });
        if (!FindProduct && !FindProduct.Supplier_ID) {
            return res.status(402).json({
                success: false,
                message: `product /supplier are not found : ${FindProduct.Supplier_ID}`,
            })
        }

        const CustomerName = await Location.findById({ _id: location_ID });
        const UpdateUserProfile = await UserActivity.findOneAndUpdate({ Location_ID: CustomerName._id }, {
            $push: {
                PurchaseOrder: FindProduct._id
            }
        }, { new: true });
        // create purchase order 

        const CreatPurchaseOrder = await PO.create({
            location_ID: location_ID,
            CreatedOn: Date.now(),
            CreatedBY: `${CustomerName.FirstName}" "${CustomerName.LastName}  `,
            ApprovedBy: true,
            Status: "Panding"
        });

        // Update and push item purchase  order id


        //Create order daliver 
        const createStockTransfer = await stockTransfer.create({
            location_ID: location_ID,
            CreatedOn: Date.now(),
            TransferToLOC: LOC,
            TransferToCC: CC,
            TransferredBy: `${CustomerName.FirstName}" "${CustomerName.LastName}  `,
            Status: "Painding"
        })



        // create purchase order lines
        const Save_Entry = await PO_Lines.create({
            location_ID: location_ID,
            CreatedOn: Date.now(),
            PO_ID: CreatPurchaseOrder._id,
            Catalogs_ID: FindProduct.Catalogs_ID,
            Product_ID: FindProduct.Product_ID,
            Variant_ID: FindProduct._id,
            Supplier_ID: FindProduct.Supplier_ID,
            StockTransfer_ID: createStockTransfer._id,
            ItmeName: FindProduct.ItmeName,
            SKU: FindProduct.SUK,
            UOM: FindProduct.UOM,
            UnitePrice: FindProduct.PurchasePrice,
            OrderQTY: OrderQTY,
            TotalPrice: ((FindProduct.PurchasePrice) * OrderQTY),

        });

        // Update payment detailes 
        const FindPaymentIdAndUpdate = await PaymentGitwaya.findByIdAndUpdate({ _id: PaymentId }, {
            success: true,
            CustromeId: location_ID,
            Po_line_ID: Save_Entry._id
        }, { new: true });

        // save data in supplier account
        const FindSupplierID = await Supplier.findByIdAndUpdate({ _id: FindProduct.Supplier_ID }, {
            $push: {
                PO_Lines: Save_Entry._id,
                StockTransfer: createStockTransfer._id,

            }
        }, { new: true });

        // console.log(FindSupplierID);



        // create saler Order 
        const CreatSalesOrder = await SalesOrder.create({
            location_ID: location_ID,
            CreatedOn: Date.now(),
            ProfiteCounterID: FindSupplierID._id,
            OrderType: OrderType,
            InvStatus: FindSupplierID.Status,
            CreatedBy: "Supplier",
            Status: "painding"
        })


        // Sales Order line 
        const CreatSalesOrderLine = await SalesOrderLine.create({
            location_ID: location_ID,
            CreatedOn: Date.now(),
            Order_ID: CreatPurchaseOrder._id,
            Variants_ID: FindProduct._id,
            SUK: FindProduct.SUK,
            ItmeName: FindProduct.ItmeName,
            UnitPrice: FindProduct.PurchasePrice,
            QTY: OrderQTY,
            TotalPrice: FindProduct.PurchasePrice * OrderQTY,
            Status: "painding"

        })

        // Save payment Detailes

        // sales invoice
        const CreatInvoice = await SalesInvoice.create({
            location_ID: location_ID,
            CreatedOn: Date.now(),
            Order_ID: CreatPurchaseOrder._id,
            SubTotal: FindProduct.PurchasePrice,
            TotalTAX: ((FindProduct.PurchasePrice / 100) * 18),
            DiscountPerc: ((FindProduct.PurchasePrice / 100) * 5),
            AmountPayable: (FindProduct.PurchasePrice * ((FindProduct.PurchasePrice / 100) * 5)) / ((FindProduct.PurchasePrice / 100) * 18),
            PaymentType: "Case On Delivary"
        })

        // return success responce
        const AllData = [CreatPurchaseOrder, createStockTransfer, Save_Entry, FindSupplierID, CreatSalesOrder, CreatSalesOrderLine, CreatInvoice, FindPaymentIdAndUpdate, UpdateUserProfile];

        return res.status(200).json({
            success: true,
            message: "success fully   product order lines creat ",
            AllData
        })

    } catch (error) {
        console.log("error in Product Order Lines controller");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `error in Product Order controller lines :- ${error} `,
        })


    }
}

// show all order 

exports.ShowAllOrder = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;

        if (!location_ID) {
            return res.state(400).json({
                success: false,
                message: "location id is not found"
            })
        }

        const findSupplier = await Supplier.findOne({ location_ID: location_ID })
            .populate("StockTransfer")
            .populate({
                path: "PO_Lines",
                populate: {
                    path: "Variant_ID",

                }
            }).exec();

        return res.status(200).json({
            success: true,
            message: "order related all data",
            findSupplier
        })


    } catch (error) {
        console.log("error in ShowAllOrder controller");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `error in ShowAllOrder lines :- ${error} `,
        })

    }
}

// product delivery to custromer
exports.ShowProductDeliveary = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;
        const Id = req.user.id;

        const FindSupplierAccount = await Supplier.findById({ _id: Id }).populate('StockTransfer').exec();

        return res.state(200).json({
            success: true,
            message: "all Upcoming order ,find success fully ",
            FindSupplierAccount
        })


    } catch (error) {
        console.log("error in ShowProductDeliveary  controller");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `error in ShowProductDeliveary  lines :- ${error} `,
        })

    }
}

exports.ProductDelivery = async(req, res) => {
        try {
            const { StransferId } = req.body;
            const findStransfermodule = await stockTransfer.findByIdAndUpdate({ _id: StransferId }, {
                Status: "Order Shipt"
            }, { new: true })

            return res.status(200).json({
                success: true,
                message: "Order shipt in your select location"
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "samthing in error in ProductDelivery  controller"
            })
        }

    }
    //transport order itme seller to inventory

exports.OrderFullFiledInSeller = async(req, res) => {
    try {
        const { ID } = req.body;
        if (!ID) {
            return res.status(401).json({
                success: false,
                message: "full fail all request"
            });
        }

        const findProductVarientId = await Variants.findById({ _id: ID });
        const SellerLocationId = findProductVarientId.location_ID;
        const SallerOrderManagementID = await SallerOderDetails.findByIdAndUpdate({ location_ID: SellerLocationId }, {
            $push: {
                UpcommingOrder: ID
            }
        }, { new: true });

        // return success responce
        return res.status(200).json({
            success: true,
            message: "success fully update ",
            SallerOrderManagementID,
        })

    } catch (error) {
        console.log("error in Upcomming Product In Inventory  controller");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `error in Upcomming Product In Inventory  lines :- ${error} `,
        })

    }
}

// searching acount in email id
exports.SerchingAccount = async(req, res) => {
    try {
        const { Email } = req.body;
        const findUserLocation = await UserActivity.findOne({ Email: Email });

        if (!findUserLocation) {
            return res.status(400).json({
                success: false,
                message: "email id are not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "success fully find user ",
            findUserLocation
        })

    } catch (error) {


        return res.status(500).json({
            success: false,
            message: `error in Upcomming SerchingAccount  lines :- ${error} `,
        })

    }
}

exports.UpdateInventoryManament = async(req, res) => {
    try {
        // const location_ID = req.user.Location_ID;
        // const Id = req.user.id;
        const Email = req.user.email;

        const { FirstSet, SecondSet, ThirdSet, ForthSet } = req.body;

        const UpdatedData = await InventoryManagement.findOneAndUpdate({ email: Email }, {
            FirstSet: FirstSet,
            SecondSet: SecondSet,
            ThirdSet: ThirdSet,
            ForthSet: ForthSet
        }, { new: true });

        return res.status(201).json({
            success: true,
            message: "data add success fully",
            UpdatedData
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: `error in Update InventoryManament  lines :- ${error} `,
        })

    }
}


exports.GetAllInventoryManagementData = async(req, res) => {
    try {

        let Array = []
        let FirstSetArray = []
        let PriceDataArray = []
        let ThirdSetArray = []
        let ForthSetArray = []
        const ShowAllData = await InventoryManagement.findOne({});
        for (let i = 0; i < ShowAllData.FirstSet.length; i++) {
            const FirstSetData = (await Variants.find({ UOM: ShowAllData.FirstSet[i] }))
            FirstSetData.map((data, index) => {
                if (index < 4) {
                    FirstSetArray.push(data);
                }
            })
            Array.push(FirstSetArray);
            FirstSetArray = [];
        }

        const PriseData = (await Variants.find({ PurchasePrice: { $lte: ShowAllData.SecondSet } })).forEach((Product, index) => {
            if (index < 5) {
                PriceDataArray.push(Product)
            }
        });
        const ThirdSet = (await Variants.find({ Product_ID: ShowAllData.ThirdSet })).forEach((Item, index) => {
            if (index < 3) {
                ThirdSetArray.push(Item);
            }
        })
        const ForthSet = (await Variants.find({ UOM: ShowAllData.ForthSet })).forEach((Items, index) => {
            if (index < 6) {
                ForthSetArray.push(Items);
            }
        })



        return res.status(200).json({
            success: true,
            message: "success fully fetch all data",
            Array,
            PriceDataArray,
            ThirdSetArray,
            ForthSetArray


        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `error in Update InventoryManament  lines :- ${error} `,
        })
    }
}