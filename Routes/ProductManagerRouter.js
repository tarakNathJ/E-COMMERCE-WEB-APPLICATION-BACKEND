const express = require('express');
const Router = express.Router();

const { auth, isSeller, isCustromer } = require('../Middleware/Auth');
const upload = require('../Middleware/Multer');
const {
    Product,
    CatelogController,
    Product_Serice_Controller,
    ProductVariantsController,
    AllSericeControler,
    AllOrderControler,
    AllItmeFindController,
    SellerSeeAllItme,
    FindSingleItme,
    ShowAllItmeUsing_UOM_ID,
    ShowAllItme,
    ShowAllBrand,
    ShowCatelog,
    SearchingProduct,
    showUserOrder
} = require('../Controllers/ProductManager');

Router.post('/Product', auth, isSeller, upload.single('image'), Product);
Router.post('/Catlog', auth, isSeller, upload.single('image'), CatelogController);
Router.post('/Serice', auth, isSeller, Product_Serice_Controller);
Router.post('/Variant', auth, isSeller, upload.single('image'), ProductVariantsController);
Router.get('/AllSerice', auth, isSeller, AllSericeControler);
Router.get('/Upcomming order', auth, isSeller, AllOrderControler);
Router.get('/AllItme', AllItmeFindController);
Router.get('/OwnItme', auth, isSeller, SellerSeeAllItme, );
Router.get('/SingleItme', FindSingleItme);
Router.post('/ShowAllItmeUsing_UOM_ID', ShowAllItmeUsing_UOM_ID);
Router.get('/ShowAllItme', ShowAllItme);
Router.get('/ShowAllBrand', ShowAllBrand);
Router.post('/ShowCatelog', ShowCatelog);
Router.post('/searching', SearchingProduct);
Router.post('/showAllOrder', auth, isCustromer, showUserOrder)




module.exports = Router;