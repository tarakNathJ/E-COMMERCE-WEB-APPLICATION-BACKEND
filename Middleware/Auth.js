const Jwt = require('jsonwebtoken');
const UserActivity = require('../models/UserActivity');
require('dotenv').config();
const Location = require('../models/Locations');

exports.auth = async(req, res, next) => {
    try {
        // extrack token

        const token = req.cookies.token || req.header("Authorisation").replace("Bearer ", "");
        // chack token are present or not


        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token is missing"
            })
        }

        try {
            // decode token using serect key
            const decode = Jwt.verify(token, process.env.JWT_SECRET);

            req.user = decode;


        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "sumething went wrong while validating the token"

        });

    }
}



// custromer
exports.isCustromer = async(req, res, next) => {
        try {
            if (req.user.accountType !== "Custromer") {
                return res.status(401).json({
                    success: false,
                    message: "this is a protected route for Custromer only"

                });
            }
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "user role cannot be verified"
            });
        }

    }
    //Seller
exports.isSeller = async(req, res, next) => {
    try {
        // let r = req.user.ActioneType;
        if (req.user.accountType !== "Seller") {
            return res.status(401).json({
                success: false,
                message: "this is a protected route for Seller only",

            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified"
        });
    }

}


exports.isSupplier = async(req, res, next) => {
    try {
        // let r = req.user.ActioneType;
        if (req.user.accountType !== "Supplier") {
            return res.status(401).json({
                success: false,
                message: "this is a protected route for Seller only",

            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified"
        });
    }

}

exports.isProductManager = async(req, res, next) => {
    try {
        if (req.user.ActioneType !== "ProductManager") {
            return res.status(401).json({
                success: false,
                message: "this is a protected route for ProductManager only"

            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified"
        });
    }

}

//OrganizationManager

exports.isOrganizationManager = async(req, res, next) => {
        try {
            if (req.user.ActioneType !== "OrganizationManager") {
                return res.status(401).json({
                    success: false,
                    message: "this is a protected route for OrganizationManager only"

                });
            }
            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "user role cannot be verified"
            });
        }

    }
    // InventoryManager


exports.isInventoryManager = async(req, res, next) => {
    try {
        if (req.user.accountType !== "InventoryManager") {
            return res.status(401).json({
                success: false,
                message: `this is a protected route for InventoryManager only : ${req.user}`

            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified"
        });
    }

}

// super admin
exports.isSuperAdmin = async(req, res, next) => {
    try {
        if (req.user.accountType !== "SuperAdmin") {
            return res.status(401).json({
                success: false,
                message: `this is a protected route for SuperAdmin only : ${req.user}`

            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified"
        });
    }

}

// SalesManager

exports.isSalesManager = async(req, res, next) => {
    try {
        if (req.user.ActioneType !== "SalesManager") {
            return res.status(401).json({
                success: false,
                message: "this is a protected route for SalesManager only"

            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified"
        });
    }

}


exports.StoreManagement = async(req, res, next) => {
    try {
        if (req.user.accountType !== "StoreManagement") {
            return res.status(401).json({
                success: false,
                message: "this is a protected route for deliveryTeam only"

            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified"
        });
    }

}