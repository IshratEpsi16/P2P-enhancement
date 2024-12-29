const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();

const supplierDeclarationModel = require("../../../../models/api/v1/supplierApproval/supplierRegistrationDeclaration");
const commonObject = require("../../../../common/api/v1/common");
const fileUploaderCommonObject = require("../../../../common/api/v1/fileUploader");

const verifyToken = require('../../../../middleware/jwtValidation');
const {
    userRoleAuthorization,
  } = require("../../../../middleware/authorization");


let supplier_signature_file_path = `${process.env.backend_url}${process.env.supplier_signature_file_path_name}`;
let supplier_company_seal_file_path = `${process.env.backend_url}${process.env.supplier_company_seal_file_path_name}`;

router.post('/existing-details', [verifyToken], async (req, res) => {

    let userId = req.body.USER_ID;

    let result = {
        message: `Declaration details`, status: 200, success: true, data: {}, supplier_company_seal_file_path, supplier_signature_file_path
    };

    let queryResult = await supplierDeclarationModel.getDataByWhereCondition(
        { "user_id": userId }, { "id": "DESC" }, 1
    );


    await commonObject.processDbDataToArrayObject({ queryResult }); // pass reference

    if (isEmpty(queryResult) || isEmpty(queryResult.rows)) {
        result.data = {
            "USER_ID": userId,
            "AUTHOR_TYPE": null,
            "SIGNATURE_FILE_NAME": null,
            "SIGNATURE_FILE_ORIGINAL_NAME": null,
            "COMPANY_SEAL_FILE_NAME": null,
            "COMPANY_SEAL_FILE_ORIGINAL_NAME": null,
            "SIGNATORY_NAME": "",
            "IS_AGREED": false,
        }
    } else result.data = queryResult.finalData[0];


    return res.status(200).send(result);

});
/*
router.post('/add', [verifyToken], async (req, res) => {

    let userId = req.decoded.USER_ID; // now fix, but it will dynamic;

    let reqData = {
        "AUTHOR_TYPE": req.body.author_type,
        "SIGNATORY_NAME": req.body.signatory_name,
        "IS_AGREED": req.body.is_agreed
    }


    let id = 0;
    let willUpdate = false;
    let finalData = {};
    let currentTime = await commonObject.getTodayDateTime();

    let queryResult = await supplierDeclarationModel.getDataByWhereCondition(
        { "user_id": userId }, { "id": "DESC" }, 1, 0, ["id"]
    );

    if (!isEmpty(queryResult) && !isEmpty(queryResult.rows)) {
        willUpdate = true;
        for (const orgRow of queryResult.rows) { id = orgRow[0]; break; }
    }



    let validateDataCheck = await commonObject.characterLimitCheck(reqData.SIGNATORY_NAME, "SIGNATORY NAME");

    if (validateDataCheck.success == false)
        return res.status(400).send({ "success": false, "status": 400, "message": validateDataCheck.message });
    finalData.SIGNATORY_NAME = validateDataCheck.data;



    if (isEmpty(reqData.AUTHOR_TYPE)) return res.status(400).send({ "success": false, "status": 400, "message": "Please select author type." });

    let validateId = await commonObject.checkItsNumber(reqData.AUTHOR_TYPE);
    if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "Author type should be number. Author type should be 1: Owner, 2: Partner, 3: Authority." });
    finalData.AUTHOR_TYPE = validateId.data;

    if (![1, 2, 3].includes(finalData.AUTHOR_TYPE)) return res.status(400).send({ "success": false, "status": 400, "message": "Author type should be 1: Owner, 2: Partner, 3: Authority." });


    finalData.IS_AGREED = [true, 1, "1", 'true'].includes(reqData.IS_AGREED) ? 1 : 0;


    if (req.files && Object.keys(req.files).length > 0 && req.files.signature_file) {
        let fileUploadCode = {};

        fileUploadCode = await fileUploaderCommonObject.uploadFile(
            req,
            "signatureFile",
            "signature_file"
        );

        if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })


        finalData.SIGNATURE_FILE_NAME = fileUploadCode.fileName;
        finalData.SIGNATURE_FILE_ORIGINAL_NAME = fileUploadCode.fileOriginalName;

    } else if (!willUpdate) return res.status(400).send({ "success": false, "status": 400, "message": "Please give signature." });


    if (req.files && Object.keys(req.files).length > 0 && req.files.company_seal) {
        let fileUploadCode = {};

        fileUploadCode = await fileUploaderCommonObject.uploadFile(
            req,
            "companySeal",
            "company_seal"
        );

        if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })


        finalData.COMPANY_SEAL_FILE_NAME = fileUploadCode.fileName;
        finalData.COMPANY_SEAL_FILE_ORIGINAL_NAME = fileUploadCode.fileOriginalName;

    } else if (!willUpdate) return res.status(400).send({ "success": false, "status": 400, "message": "Please give company signature." });


    finalData.LAST_UPDATED_BY = userId;
    finalData.LAST_UPDATE_DATE = currentTime;


    if (willUpdate) {
        if (isEmpty(finalData)) return res.status(200).send({ "success": true, "status": 200, "message": "Update successfully done." });

        // update 
        let result = await supplierDeclarationModel.updateById(id, finalData);
        if (!result || result.rowsAffected == undefined || result.rowsAffected < 1)
            return res.status(500).send({ "success": false, "status": 500, "message": "Something Wrong in system database." });


    } else {

        finalData.USER_ID = userId;
        finalData.CREATED_BY = userId;
        finalData.CREATION_DATE = currentTime;

        let result = await supplierDeclarationModel.addNew(finalData);
        if (!result || result.rowsAffected == undefined || result.rowsAffected < 1)
            return res.status(500).send({ "success": false, "status": 500, "message": "Something Wrong in system database." });
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": willUpdate ? "Declaration info update successfully done" : "Declaration info successfully add."
    });


});
*/

module.exports = router;