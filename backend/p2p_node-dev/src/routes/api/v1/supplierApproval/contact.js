const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();

const moment = require("moment");

const supplierContactModel = require("../../../../models/api/v1/supplierApproval/supplierContact");
const supplierAgentModel = require("../../../../models/api/v1/supplierApproval/supplierAgent");
const commonObject = require("../../../../common/api/v1/common");
const fileUploaderCommonObject = require("../../../../common/api/v1/fileUploader");

const verifyToken = require('../../../../middleware/jwtValidation');
const {
    userRoleAuthorization,
  } = require("../../../../middleware/authorization");
  

let nid_or_passport_file_path = `${process.env.backend_url}${process.env.nid_or_passport_file_path_name}`;
let supplier_signature_file_path = `${process.env.backend_url}${process.env.supplier_signature_file_path_name}`;
let etin_file_path = `${process.env.backend_url}${process.env.etin_file_path_name}`;


router.post('/list', [verifyToken,userRoleAuthorization], async (req, res) => {

    let userId = req.body.USER_ID;
    let result = {
        message: `Supplier contact List`, status: 200, success: true, data: [],
    };


    let queryResult = await supplierContactModel.getDataByWhereCondition(
        { "user_id": userId }
    );

    await commonObject.processDbDataToArrayObject({ queryResult }); // pass reference

    if (!(isEmpty(queryResult) || isEmpty(queryResult.rows)))
        result.data = queryResult.finalData;

    return res.status(200).send(result);

});
/*
router.post('/add', [verifyToken], async (req, res) => {

    let userId = req.decoded.USER_ID; // now fix, but it will dynamic;

    let reqData = {
        "NAME": req.body.name,
        "EMAIL": req.body.email,
        "POSITION": req.body.position,
        "MOB_NUMBER_1": req.body.mobile_no_1,
        "MOB_NUMBER_2": req.body.mobile_no_2,
        "NID_PASSPORT_NUMBER": req.body.nid_passport_number,
        "IS_NID": req.body.is_nid,
        "IS_AGENT": req.body.is_agent,
    }

    let id = req.body.id;
    let supplierAgentId = 0;
    let willUpdate = false;
    let agentAction = "nothing"; // nothing = do nothing, create = create new agent, delete = delete exit supplier id data, update =  update the exit data
    let finalData = {};
    let finalAgentData = {};
    let currentTime = await commonObject.getTodayDateTime();

    finalData.IS_NID = [true, 1, "1", 'true'].includes(reqData.IS_NID) ? 1 : 0;
    finalData.IS_AGENT = [true, 1, "1", 'true'].includes(reqData.IS_AGENT) ? 1 : 0;

    if (!isEmpty(id)) {

        let validateId = await commonObject.checkItsNumber(id);

        if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "Id should be integer." });
        else id = validateId.data;

        //  check row is exit or not
        let existingData = await supplierContactModel.getDataByWhereCondition({ "id": id });

        if (isEmpty(existingData.rows))
            return res.status(404).send({ "success": false, "status": 404, "message": "No data found" });

        willUpdate = true;

        // check supplier agent details

        existingData = await supplierAgentModel.getDataByWhereCondition({ "SUPPLIER_CONTACT_PERSON_ID": id });

        if (!isEmpty(existingData.rows)) {
            await commonObject.processDbDataToArrayObject({ queryResult: existingData });
            agentAction = finalData.IS_AGENT ? "update" : "delete";
            supplierAgentId = existingData.finalData[0].ID;
        } else agentAction = finalData.IS_AGENT ? "create" : "nothing";


    } else agentAction = finalData.IS_AGENT ? "create" : "nothing";




    let validateDataCheck = await commonObject.characterLimitCheck(reqData.NAME, "NAME");
    if (validateDataCheck.success == false)
        return res.status(400).send({ "success": false, "status": 400, "message": validateDataCheck.message });
    finalData.NAME = validateDataCheck.data;


    validateDataCheck = await commonObject.characterLimitCheck(reqData.POSITION, "POSITION");
    if (validateDataCheck.success == false)
        return res.status(400).send({ "success": false, "status": 400, "message": validateDataCheck.message });
    finalData.POSITION = validateDataCheck.data;


    if (!isEmpty(reqData.NID_PASSPORT_NUMBER)) {
        let validateId = await commonObject.checkItsNumber(reqData.NID_PASSPORT_NUMBER);
        if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "NID or PASSPORT should be number." });
        finalData.NID_PASSPORT_NUMBER = validateId.data;
    }

    if (isEmpty(reqData.MOB_NUMBER_1))
        return res.status(400).send({ "success": false, "status": 400, "message": "Please give mobile number." });


    let validateMobileNumber = await commonObject.isValidPhoneNumber(reqData.MOB_NUMBER_1);
    if (validateMobileNumber == false) return res.status(400).send({ "success": false, "status": 400, "message": "Mobile number 1 is not valid" });
    finalData.MOB_NUMBER_1 = reqData.MOB_NUMBER_1;


    if (!isEmpty(reqData.MOB_NUMBER_2)) {
        let validateMobileNumber = await commonObject.isValidPhoneNumber(reqData.MOB_NUMBER_2);

        if (validateMobileNumber == false) return res.status(400).send({ "success": false, "status": 400, "message": "Mobile number 2 is not valid" });
        finalData.MOB_NUMBER_2 = reqData.MOB_NUMBER_2;

    } else finalData.MOB_NUMBER_2 = null


    if (!isEmpty(reqData.EMAIL)) {

        let validateEmail = await commonObject.isValidEmail(reqData.EMAIL);
        if (validateEmail == false) return res.status(400).send({ "success": false, "status": 400, "message": "Email is not valid" });
        finalData.EMAIL = reqData.EMAIL;

    } else finalData.EMAIL = null;


    // 
    if (req.files && Object.keys(req.files).length > 0 && req.files.nid_or_passport_file) {
        let fileUploadCode = {};

        fileUploadCode = await fileUploaderCommonObject.uploadFile(
            req,
            "nidOrPassportFile",
            "nid_or_passport_file"
        );

        if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })


        finalData.NID_PASSPORT_FILE_NAME = fileUploadCode.fileName;
        finalData.NID_PASSPORT_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
    }

    if (req.files && Object.keys(req.files).length > 0 && req.files.signature_file_path) {
        let fileUploadCode = {};

        fileUploadCode = await fileUploaderCommonObject.uploadFile(
            req,
            "signatureFile",
            "signature_file_path"
        );

        if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })


        finalData.SIGNATURE_FILE_NAME = fileUploadCode.fileName;
        finalData.SIGNATURE_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
    }

    if (finalData.IS_AGENT) {
        let reqAgentData = {
            "AGENT_NAME": req.body.agent_name,
            "AGENT_ADDRESS": req.body.agent_registered_address,
            "AGENT_SINCE_DATE": req.body.agent_since,
            "BD_PERMISSION_NO": req.body.bd_permission_no,
            "IRC": req.body.agent_irc,
            "BIN": req.body.agent_bin,
            "CONTACT_PERSON_NAME": req.body.agent_contact_person_name,
            "CONTACT_PERSON_POSITION": req.body.agent_contact_position,
            "BD_PHONE_NUMBER": req.body.agent_mobile_no,
            "EMAIL": req.body.agent_email
        }

        let validateDataCheck = await commonObject.characterLimitCheck(reqAgentData.AGENT_NAME, "Agent name");
        if (validateDataCheck.success == false)
            return res.status(400).send({ "success": false, "status": 400, "message": validateDataCheck.message });
        finalAgentData.AGENT_NAME = validateDataCheck.data;

        validateDataCheck = await commonObject.characterLimitCheck(reqAgentData.CONTACT_PERSON_NAME, "Agent contact person name");
        if (validateDataCheck.success == false)
            return res.status(400).send({ "success": false, "status": 400, "message": validateDataCheck.message });
        finalAgentData.CONTACT_PERSON_NAME = validateDataCheck.data;

        validateDataCheck = await commonObject.characterLimitCheck(reqAgentData.CONTACT_PERSON_POSITION, "Agent contact person position");

        if (validateDataCheck.success == false)
            return res.status(400).send({ "success": false, "status": 400, "message": validateDataCheck.message });
        finalAgentData.CONTACT_PERSON_POSITION = validateDataCheck.data;

        if (isEmpty(reqAgentData.EMAIL)) {
            return res.status(400).send({ "success": false, "status": 400, "message": "Please give agent email address." });
        } else {
            let validateEmail = await commonObject.isValidEmail(reqAgentData.EMAIL);
            if (validateEmail == false) return res.status(400).send({ "success": false, "status": 400, "message": "Email is not valid" });
            finalAgentData.EMAIL = reqAgentData.EMAIL;
        }

        validateDataCheck = await commonObject.characterLimitCheck(reqAgentData.AGENT_ADDRESS, "Agent address");
        if (validateDataCheck.success == false)
            return res.status(400).send({ "success": false, "status": 400, "message": validateDataCheck.message });
        finalAgentData.AGENT_ADDRESS = validateDataCheck.data;


        if (isEmpty(reqAgentData.AGENT_SINCE_DATE))
            return res.status(400).send({ "success": false, "status": 400, "message": "Please give agent since. " });

        let dateValidate = moment(reqAgentData.AGENT_SINCE_DATE)
        if (dateValidate.isValid() == false) return res.status(400).send({ "success": false, "status": 400, "message": "Invalid agent since. " });

        finalAgentData.AGENT_SINCE_DATE = new Date(dateValidate);

        if (isEmpty(reqAgentData.BD_PHONE_NUMBER))
            return res.status(400).send({ "success": false, "status": 400, "message": "Please give agent mobile number." });


        let validateMobileNumber = await commonObject.isValidPhoneNumber(reqAgentData.BD_PHONE_NUMBER);
        if (validateMobileNumber == false) return res.status(400).send({ "success": false, "status": 400, "message": "Agent mobile number is not valid" });
        finalAgentData.BD_PHONE_NUMBER = reqAgentData.BD_PHONE_NUMBER;

        if (!isEmpty(reqAgentData.BIN)) {
            let validateId = await commonObject.checkItsNumber(reqAgentData.BIN);
            if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "Bin should be number." });
            finalAgentData.BIN = validateId.data;
        }

        if (!isEmpty(reqAgentData.IRC)) {
            let validateId = await commonObject.checkItsNumber(reqAgentData.IRC);
            if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "IRC should be number." });
            finalAgentData.IRC = validateId.data;
        }

        if (!isEmpty(reqAgentData.BD_PERMISSION_NO)) {
            let validateId = await commonObject.checkItsNumber(reqAgentData.BD_PERMISSION_NO);
            if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "Bd permission no should be number." });
            finalAgentData.BD_PERMISSION_NO = validateId.data;
        }



        if (req.files && Object.keys(req.files).length > 0 && req.files.etin_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "etinFile",
                "etin_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalAgentData.TIN_FILE_NAME = fileUploadCode.fileName;
            finalAgentData.TIN_FILE_ORIGINAL_NAME = fileUploadCode.fileOriginalName;

        }

        finalAgentData.LAST_UPDATED_BY = userId;
        finalAgentData.LAST_UPDATE_DATE = currentTime;


    }


    finalData.LAST_UPDATED_BY = userId;
    finalData.LAST_UPDATE_DATE = currentTime;


    if (willUpdate) {
        if (isEmpty(finalData)) return res.status(200).send({ "success": true, "status": 200, "message": "Update successfully done." });

        finalAgentData.SUPPLIER_CONTACT_PERSON_ID = id;

        // update 
        let result = await supplierContactModel.updateById(id, finalData, {
            "action": agentAction,
            "supplier_agent_id": supplierAgentId,
            "data": finalAgentData
        });

        if (!result || result.rowsAffected == undefined || result.rowsAffected < 1)
            return res.status(500).send({ "success": false, "status": 500, "message": "Something Wrong in system database." });


    } else {

        finalData.USER_ID = userId;
        finalData.CREATED_BY = userId;
        finalData.CREATION_DATE = currentTime;

        let result = await supplierContactModel.addNew(finalData, finalAgentData);
        if (!result || result.rowsAffected == undefined || result.rowsAffected < 1)
            return res.status(500).send({ "success": false, "status": 500, "message": "Something Wrong in system database." });
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": willUpdate ? "Supplier contact info update successfully done" : "Supplier contact info successfully add"
    });


});

*/

router.post('/details', [verifyToken,userRoleAuthorization], async (req, res) => {

    let userId = req.body.USER_ID;
    let id = req.body.id;

    let result = {
        message: `Supplier agent details`, status: 200, success: true, data: {}, nid_or_passport_file_path, supplier_signature_file_path, etin_file_path
    };


    let queryResult = await supplierContactModel.getDataByWhereCondition(
        { "user_id": userId, "id": id }, { "id": "DESC" }, 1
    );

    if (isEmpty(queryResult) || queryResult.rows.length < 1)
        return res.status(404).send({ "success": false, "status": 404, "message": "No data found" });


    await commonObject.processDbDataToArrayObject({ queryResult }); // pass reference


    if (queryResult.finalData[0].IS_AGENT) {
        // get agent info
        let existingAgentData = await supplierAgentModel.getDataByWhereCondition({ "SUPPLIER_CONTACT_PERSON_ID": id });

        if (!isEmpty(existingAgentData.rows)) {
            await commonObject.processDbDataToArrayObject({ queryResult: existingAgentData });
            queryResult.finalData[0].AGENT_DETAILS = existingAgentData.finalData[0];
        }
    }

    result.data = queryResult.finalData[0];


    return res.status(200).send(result);

});


module.exports = router;