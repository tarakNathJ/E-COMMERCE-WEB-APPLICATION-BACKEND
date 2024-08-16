const ExpenseTypes = require("../models/ExpenseType");
const Expence = require('../models/Expense');
const LocationId = require('../models/Locations');

exports.ExpenseController = async(req, res) => {
    try {
        const { LocationID, ExpenseType } = req.body;
        if (!LocationID || !ExpenseType) {
            return res.status(401).json({
                success: false,
                message: "full fail all request"
            })
        }

        const CreatExpense = await ExpenseTypes.create({
            location_ID: LocationID,
            CreatedOn: Date.now(),
            ExpenseType: ExpenseType,
            Status: 'painding'


        })

        return res.status(200).json({
            success: true,
            message: "sucess fully create Expence type"
        })
    } catch (error) {
        console.log("error in Expense  controller");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `error in Expence  lines :- ${error} `,
        })
    }
}

// 
exports.Expence = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;
        const { LocationID, ExpenseYear, ExpenseMonth, Description, Amount, CreatedBy, ApprovedBy } = req.body;
        if (!LocationID || !ExpenseYear || !ExpenseMonth || !Description || !Amount || !CreatedBy || !ApprovedBy) {
            return res.status(401).json({
                success: false,
                message: "full fail all request"
            })
        }

        const FindExpenceType = await ExpenseTypes.findById({ _id: LocationID });
        const FindByFinanceManagerName = await LocationId.findById({ _id: location_ID });


        const CreatExpence = await Expence.create({
            CreatedOn: Date.now(),
            ExpenseType_ID: FindExpenceType._id,
            ExpenseYear: ExpenseYear,
            ExpenseMonth: ExpenseMonth,
            Description: Description,
            Amount: Amount,
            CreatedBy: ` ${ FindByFinanceManagerName.FirstName}  ${ FindByFinanceManagerName.LastName } `,
            Status: "painding",


        })

    } catch (error) {

    }
}