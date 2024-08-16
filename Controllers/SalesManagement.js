const PO_Line = require('../models/PoLines');
const Return_Order = require('../models/ReturnOrder');
const Invoice = require('../models/Invoice');
const Location = require('../models/Locations');
const CraditNotes = require('../models/CraditeNote');
const ReturnOrderLine = require('../models/ReturnLines');





exports.ReturnOrder = async(req, res) => {
    try {
        const location_ID = req.user.Location_ID;
        const Id = req.user.id;
        const { PO_LineID, ReturnReason, ApprovalStatus, CreaditNote, Condition } = req.body;
        if (!PO_LineID) {
            return res.status(400).json({
                success: false,
                message: "not found purchace order line"
            })
        }

        const findPO_LineID = await PO_Line.findById({ _id: PO_LineID });
        const findInvoice = await Invoice.findOne({ location_ID: findPO_LineID.location_ID });
        const findByUser = await Location.findById({ _id: findPO_LineID.location_ID });
        // create return order 

        const Return_OD = await Return_Order.create({
            location_ID: findPO_LineID.location_ID,
            CreatedOn: Date.now(),
            Order_ID: findPO_LineID.PO_ID,
            OrderDate: findPO_LineID.CreatedOn,
            ReturnReason: ReturnReason,
            ApprovalStatus: ApprovalStatus,
            ApprovalBy: true,
            CreaditNote: CreaditNote,
            ReturnAmount: findInvoice.AmountPayable,
            CreatedBy: `${findByUser.FirstName}" "${findByUser.LastName}`,
            Status: "Painding"

        })

        // create return order line 
        const ReturnOD_Line = await ReturnOrderLine.create({
            location_ID: findPO_LineID.location_ID,
            CreatedOn: Date.now(),
            ReturnOrder_ID: findPO_LineID.PO_ID,
            Variants_ID: findPO_LineID.Variant_ID,
            SUK: findPO_LineID.SKU,
            ItmeName: findPO_LineID.ItmeName,
            UnitPrice: findPO_LineID.UnitePrice,
            QTY: findPO_LineID.OrderQTY,
            TotalPrice: findInvoice.AmountPayable,
            Condition: Condition,
            Status: "Painding"
        })

        // create return cradit
        const CreaditNotice = await CraditNotes.create({
            location_ID: findPO_LineID.location_ID,
            CreatedOn: Date.now(),
            ReturnOrder_ID: Return_OD._id,
            ReturnAmount: Return_OD.ReturnAmount
        })

        const AllData = [Return_OD, ReturnOD_Line, CreaditNotice];
        return res.status(200).json({
            success: true,
            message: "success fully cancel your order",
            AllData
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