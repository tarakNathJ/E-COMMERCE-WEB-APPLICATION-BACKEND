const express = require("express");

const Routes = express.Router();

const { SendMail, SignUp, login, changePassword, AddUserAllDetails, changePasswordSecondOption, FindUserController, UpdatSuperUserProfile } = require('../Controllers/Auth');
const { auth, isSuperAdmin } = require('../Middleware/Auth');

Routes.post("/sendOTP", SendMail);

Routes.post("/signUp", SignUp);

Routes.post("/login", login);
Routes.post("/AddDetails", auth, AddUserAllDetails);

Routes.post("/ChangePassword", changePassword);
Routes.post("/ResetPassword", changePasswordSecondOption);

Routes.post('/findUser', auth, isSuperAdmin, FindUserController);
Routes.post('/UpdateSuperUser', auth, isSuperAdmin, UpdatSuperUserProfile);
module.exports = Routes;