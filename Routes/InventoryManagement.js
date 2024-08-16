const express = require('express');
const Router = express.Router();

const { auth, isInventoryManager, isSupplier, isSuperAdmin, isCustromer } = require('../Middleware/Auth');
const {
    SupplierController,
    stockTransferUpdateController,
    PurchaseOrderLines,
    ShowAllOrder,
    OrderFullFiledInSeller,
    SerchingAccount,
    ShowUpcommingStock,
    ExceptUpcommingStock,
    UpdateInventoryManament,
    ShowProductDeliveary,
    GetAllInventoryManagementData,

} = require('../Controllers/InventoryManagement');

Router.post('/Supplier', auth, isSuperAdmin, SupplierController);
Router.post('/purchaceOrder', auth, isCustromer, PurchaseOrderLines);
Router.post('/StockUpdate', auth, isSupplier, stockTransferUpdateController);
Router.get('/UpdateSellerStock', auth, isInventoryManager, OrderFullFiledInSeller);
Router.post('/FindUser', auth, isSuperAdmin, SerchingAccount);
Router.post('/ShowUpcommingStock', auth, isSupplier, ShowUpcommingStock);
Router.post('/ExceptUpcommingStock', auth, isSupplier, ExceptUpcommingStock)
Router.post('/ShowAllOrder', auth, isSupplier, ShowAllOrder);
Router.get('/ShowProductDeliveary', auth, isInventoryManager, ShowProductDeliveary);
Router.post('/UpdateFontedPage/Data', auth, isSuperAdmin, UpdateInventoryManament);
Router.get('/GetAllFirstPageData', GetAllInventoryManagementData);


module.exports = Router;