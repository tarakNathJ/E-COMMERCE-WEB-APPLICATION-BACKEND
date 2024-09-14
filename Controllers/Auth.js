const OTP_Module = require('../models/OTP');
const Locations_module = require('../models/Locations');
const OTP_Generator = require("otp-generator");
const bcrypt = require("bcryptjs");
const MailSender = require('../Utile/MailSender');
const jwt = require('jsonwebtoken');
const UserActivity = require('../models/UserActivity');
const RefDoc = require('../models/RefDocNun');
const SuperUser = require('../models/SuperUser');
const InventoryManagement = require('../models/InventoryManagement');



// send mail controller
exports.SendMail = async(req, res) => {
    try {
        // fetch email for request body
        const { email } = req.body;


        // generate otp    
        const otp = OTP_Generator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        const emailResponse = await MailSender(
            email,
            "OTP",
            `${otp}`,
        );

        // save data for otp modle
        const SaveOTP = new OTP_Module({
            email,
            otp
        });

        const saveData = await SaveOTP.save();


        // return success responce for complete process
        return res.status(200).json({
            success: true,
            saveData,

        })



    } catch (error) {
        // return success responce for incomplete process

        res.status(500).json({

            success: false,
            message: "mail sending failed in controller/sendmailer",
        })
    }
}



// signup controller
exports.SignUp = async(req, res) => {
    try {
        // fetch data for request body
        const { FirstName, LastName, Email, Password, ReEnterPassword, OTP, ActioneType = "Custromer", state = "" } = req.body;


        // chack chack all data
        if (!FirstName || !LastName || !Email || !Password || !ReEnterPassword || !OTP || !ActioneType) {
            return res.status(401).json({
                success: false,
                message: "full fill all request",
            });
        }


        // check email id all ready present or not
        const ChackEmail = await Locations_module.findOne({ Email: Email });

        if (ChackEmail) {
            return res.status(401).json({
                success: false,
                message: "this  email allready used",
                ChackEmail
            });
        }


        // chack otp
        const ChackOTP = await OTP_Module.find({ email: Email }).sort({ createdAt: -1 }).limit(1);

        console.log(ChackOTP);
        if (ChackOTP[0].email !== Email) {
            return res.status(401).json({
                success: false,
                message: `invalid email id `,
            });
        }


        if (ChackOTP[0].otp != OTP) {
            return res.status(401).json({
                success: false,
                message: `invalid  otp  try next time :-  ${ChackOTP[0].otp} : ${OTP} `,
            });
        }





        // chack passward  both are same or not
        if (Password != ReEnterPassword) {
            return res.status(401).json({
                success: false,
                message: `both password are wrong   ${password}  - ${ReEnterPassword},`

            });
        }

        //hashing password
        const hashedPassword = await bcrypt.hash(Password, 8);

        // creat new enter in location
        const save_location = await Locations_module.create({
            FirstName: FirstName,
            LastName: LastName,
            Email: Email,
            state: state,
        });
        //  creat new entre in UserActivity

        const Save_UserActivity = await UserActivity.create({
            Location_ID: save_location._id,
            Email: save_location.Email,
            Password: hashedPassword,
            ActioneType: ActioneType
        })

        return res.status(200).json({
            success: true,
            message: "success fully complete process",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server site error",
        })
    }
}


// login
exports.login = async(req, res) => {
    try {
        // get data from req body
        const { Email, password } = req.body;
        // validation data
        if (!Email || !password) {
            return res.status(403).json({
                success: false,
                message: "all fields are required ,please try again",

            });

        }

        // find user is present or not
        const user = await UserActivity.findOne({ Email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user is not registrered,please signup first",

            });

        }

        // generate jwt ,after password  matching
        if (bcrypt.compare(password, user.Password)) {
            const payload = {
                email: user.Email,
                id: user._id,
                accountType: user.ActioneType,
                Location_ID: user.Location_ID
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.Password = undefined;
            // create cookie and send responsse
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            return res.cookie("token", token).status(200).json({
                success: true,
                token,
                user,
                message: "logged in successfully",
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "password is incorrect"
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failed try again ..",

        })

    }
}

// add user all details

exports.AddUserAllDetails = async(req, res) => {
    try {

        const Id = req.user.id;

        // fetch request in user body
        const { ActionBy = '', Description = '', EntryNum = '', TranSactionType = '' } = req.body;
        // chack user id are hear or not
        if (!Id) {
            return res.status(400).json({
                succecc: false,
                message: "user id are not present"
            })

        }

        // chach user are present or not
        const findUser = await UserActivity.findById(Id);
        if (!findUser) {
            return res.status(400).json({
                succecc: false,
                message: "user  not present this id "
            })

        }

        // generate Refcode    
        const Ref = OTP_Generator.generate(9, { specialChars: false });

        // save data

        const save_data = await UserActivity.findByIdAndUpdate({ _id: Id }, { TranSactionType: TranSactionType, RefDocNum: Ref, EntryNum: EntryNum, Description: Description, ActionBy: ActionBy });

        return res.status(200).json({
            succecc: true,
            message: "success fully data update",
            save_data
        })





    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "sorry ,could not fullfill your request, try again ..",

        })
    }
}

// changePassword

exports.changePassword = async(req, res) => {

    try {

        // get user id 
        const id = req.user.id;
        // get data from req body
        // get oldPassword ,new password  ,confurm password
        const { oldPassword, password, confirmPassword } = req.body;


        // validation
        if (!password || !confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "password and confirmPassword dose not match",
            })
        }
        // find by user and chack password
        const chackUser = await Locations_module.findById({ _id: id });
        // chack old password maching or not

        if (await bcrypt.compare(oldPassword, chackUser.Password)) {

            //hashing password
            const hashedPassword = await bcrypt.hash(password, 8);

            // update pwd in db
            const updatePassword = await Locations_module.findByIdAndUpdate({ _id: id }, { password: hashedPassword }, { new: true });

            // send mail - password update
            const emailResponse = await MailSender(
                enrolledStudent.email,
                "success fully your password change",
                "congratulations ,your password will change ",
            );
            // return response
            return res.status(200).json({
                success: true,
                message: "success fully password update",
                updatePassword,
            });


        } else {
            return res.status(400).json({
                success: false,
                message: "your old password are not match",
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "sorry ,plece try again to change password",
        });

    }
}

exports.changePasswordSecondOption = async(req, res) => {
    try {
        // fetch Data for request for body 
        const { FirstName, LastName, Email, password } = req.body;
        if (!Email || !FirstName || !LastName || !password) {
            return res.status(403).json({
                success: false,
                message: "all fields are required ,please try again",

            });

        }


        // find email 
        const findEmail = await Locations_module.findOne({ Email: Email }, { FirstName: FirstName, LastName: LastName });
        // hashed password
        const hashedPassword = await bcrypt.hash(password, 8);

        const FindUserActivation = await UserActivity.findOneAndUpdate({ Location_ID: findEmail._id }, {
            Password: hashedPassword
        }, { new: true }).populate('Location_ID').exec();
        return res.status(200).json({
            success: true,
            FindUserActivation

        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "sorry ,plece try again to change password",
        });

    }
}


exports.FindUserController = async(req, res) => {
    try {
        const { Email } = req.body;
        if (!Email) {
            return res.status(401).json({
                success: false,
                message: "all fields are required ,please try again",

            });
        }

        const UserDetailes = await Locations_module.findOne({ Email: Email })
        if (!UserDetailes) {
            return res.status(401).json({
                succecc: false,
                message: 'user are not present'
            })

        }

        return res.status(200).json({
            succecc: true,
            message: "user are present ",
            UserDetailes

        })
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "sorry ,plece try again to change password",
        });

    }
}

// Update Super Admin profile
exports.UpdatSuperUserProfile = async(req, res) => {
    try {
        const { email } = req.user;


        if (!email) {
            return res.status(400).json({
                succecc: false,
                message: "email id are not found"
            })
        }

        const ChackThisIsSuperUser = await UserActivity.findOne({ Email: email });
        if (ChackThisIsSuperUser.ActioneType !== "SuperAdmin") {
            return res.status(401).json({
                succecc: false,
                message: "only use super user email id"
            })
        }

        const chachEmail = await SuperUser.findOne({ email: email });
        if (chachEmail) {
            return res.status(400).json({
                succecc: false,
                message: "account all ready Updated"
            })
        }


        const UpdateProfile = await SuperUser.create({ email: email });
        const CreateDaseBord = await InventoryManagement.create({
            email: email,
            SuperAdmin: UpdateProfile._id,
        })
        let AllData = [UpdateProfile, CreateDaseBord];
        return res.status(200).json({
            succecc: true,
            massage: "profile updated success fully",
            AllData
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "sorry ,plece try again to Update profile",
        });

    }
}