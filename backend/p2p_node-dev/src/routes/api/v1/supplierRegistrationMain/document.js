const express = require("express");
const isEmpty = require("is-empty");
const router = express.Router();

const moment = require("moment");

const supplierDocumentModel = require("../../../../models/api/v1/supplierRegistrationDocument");
const commonObject = require("../../../../common/api/v1/common");
const fileUploaderCommonObject = require("../../../../common/api/v1/fileUploader");

const verifyToken = require('../../../../middleware/jwtValidation');

let imageFile = [
    {
        trade_or_export_license_file_path_name: `${process.env.backend_url}${process.env.trade_or_export_license_file_path_name}`,
        etin_file_path_name: `${process.env.backend_url}${process.env.etin_file_path_name}`,
        ebin_file_path_name: `${process.env.backend_url}${process.env.ebin_file_path_name}`,
        tax_rtn_ackn_slip_file_path_name: `${process.env.backend_url}${process.env.tax_rtn_ackn_slip_file_path_name}`,
    },
    {
        incorporation_cirtificate_file_path_name: `${process.env.backend_url}${process.env.incorporation_cirtificate_file_path_name}`,
        memorandum_association_file_path_name: `${process.env.backend_url}${process.env.memorandum_association_file_path_name}`,
        authorized_signs_file_path_name: `${process.env.backend_url}${process.env.authorized_signs_file_path_name}`,
        article_association_file_path_name: `${process.env.backend_url}${process.env.article_association_file_path_name}`,
        prominent_clients_file_path_name: `${process.env.backend_url}${process.env.prominent_clients_file_path_name}`,
    },
    {
        annual_turnover_file_path_name: `${process.env.backend_url}${process.env.annual_turnover_file_path_name}`,
        qa_cirtificate_file_path_name: `${process.env.backend_url}${process.env.qa_cirtificate_file_path_name}`,
        company_profile_file_path_name: `${process.env.backend_url}${process.env.company_profile_file_path_name}`,
        recommendation_cirtificate_file_path_name: `${process.env.backend_url}${process.env.recommendation_cirtificate_file_path_name}`,
        excellency_specialied_cirtificate_file_path_name: `${process.env.backend_url}${process.env.excellency_specialied_cirtificate_file_path_name}`,
        company_bank_solvency_cirtificate_file_path_name: `${process.env.backend_url}${process.env.company_bank_solvency_cirtificate_file_path_name}`,
        goods_list_file_path_name: `${process.env.backend_url}${process.env.goods_list_file_path_name}`,
    },
    {
        machine_manpower_list_file_path_name: `${process.env.backend_url}${process.env.machine_manpower_list_file_path_name}`,
        business_premises_file_path_name: `${process.env.backend_url}${process.env.business_premises_file_path_name}`,
        profile_pic1_file_path_name: `${process.env.backend_url}${process.env.profile_pic1_file_path_name}`,
        profile_pic2_file_path_name: `${process.env.backend_url}${process.env.profile_pic2_file_path_name}`,
    }
]


router.post('/existing-details', [verifyToken], async (req, res) => {

    let userId = req.decoded.USER_ID;
    let page = [1, 2, 3, 4, "1", "2", "3", "4"].includes(req.body.page_no) ? req.body.page_no : 1;

    let result = {
        message: `Supplier document details`, status: 200, success: true, data: {}, ...imageFile[page - 1]
    };

    let queryResult = await supplierDocumentModel.getDataByWhereCondition(
        { "user_id": userId }, { "id": "DESC" }, 1
    );

    await commonObject.processDbDataToArrayObject({ queryResult }); // pass reference

    if (isEmpty(queryResult) || isEmpty(queryResult.rows)) {

        if (page == 1) result.data = {
            "TRADE_OR_EXPORT_LICENSE_NUMBER": "",
            "TRADE_OR_EXPORT_LICENSE_START_DATE": "",
            "TRADE_OR_EXPORT_LICENSE_END_DATE": "",
            "TRADE_OR_EXPORT_LICENSE_FILE_NAME": "",
            "TRADE_OR_EXPORT_LICENSE_ORIGINAL_FILE_NAME": "",
            "ETIN_NUMBER": "",
            "ETIN_FILE_NAME": "",
            "ETIN_ORG_FILE_NAME": "",
            "EBIN_NUMBER": "",
            "EBIN_FILE_NAME": "",
            "EBIN_ORG_FILE_NAME": "",
            "TAX_RTN_ASSMNT_YEAR": "",
            "TAX_RTN_ACKN_SLIP_FILE_NAME": "",
            "TAX_RTN_ACKN_SLIP_ORIGINAL_FILE_NAME": ""

        }

        else if (page == 2) result.data = {
            "INCORPORATION_NUMBER": "",
            "INCORPORATION_CIRTIFICATE_FILE_NAME": "",
            "INCORPORATION_CIRTIFICATE_ORIGINAL_FILE_NAME": "",

            "MEMORANDUM_ASSOCIATION_FILE_NAME": "",
            "MEMORANDUM_ASSOCIATION_ORIGINAL_FILE_NAME": "",

            "AUTHORIZED_SIGNS_FILE_NAME": "",
            "AUTHORIZED_SIGNS_ORIGINAL_FILE_NAME": "",

            "ARTICLE_ASSOCIATION_FILE_NAME": "",
            "ARTICLE_ASSOCIATION_ORIGINAL_FILE_NAME": "",

            "PROMINENT_CLIENTS_FILE_NAME": "",
            "PROMINENT_CLIENTS_ORIGINAL_FILE_NAME": "",

        }

        else if (page == 3) result.data = {

            "GOODS_LIST_FILE_NAME": "",
            "GOODS_LIST_ORG_FILE_NAME": "",

            "COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME": "",
            "COMPANY_BANK_SOLVENCY_CIRTIFICATE_ORIGINAL_FILE_NAME": "",

            "EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME": "",
            "EXCELLENCY_SPECIALIED_CIRTIFICATE_ORIGINAL_FILE_NAME": "",

            "RECOMMENDATION_CIRTIFICATE_FILE_NAME": "",
            "RECOMMENDATION_CIRTIFICATE_ORIGINAL_FILE_NAME": "",

            "COMPANY_PROFILE_FILE_NAME": "",
            "COMPANY_PROFILE_ORIGINAL_FILE_NAME": "",

            "QA_CIRTIFICATE_FILE_NAME": "",
            "QA_CIRTIFICATE_ORIGINAL_FILE_NAME": "",

            "ANNUAL_TURNOVER_FILE_NAME": "",
            "ANNUAL_TURNOVER_ORIGINAL_FILE_NAME": "",

        }

        else if (page == 4) result.data = {

            "MACHINE_MANPOWER_LIST_FILE_NAME": "",
            "MACHINE_MANPOWER_LIST_ORIGINAL_FILE_NAME": "",

            "BUSINESS_PREMISES_FILE_NAME": "",
            "BUSINESS_PREMISES_ORIGINAL_FILE_NAME": "",

            "PROFILE_PIC1_FILE_NAME": "",
            "PROFILE_PIC1_ORIGINAL_FILE_NAME": "",

            "PROFILE_PIC2_FILE_NAME": "",
            "PROFILE_PIC2_ORIGINAL_FILE_NAME": "",

        }



    } else if (page == 1) {

        result.data = {
            "TRADE_OR_EXPORT_LICENSE_NUMBER": queryResult.finalData[0].TRADE_OR_EXPORT_LICENSE_NUMBER,
            "TRADE_OR_EXPORT_LICENSE_START_DATE": queryResult.finalData[0].TRADE_OR_EXPORT_LICENSE_START_DATE,
            "TRADE_OR_EXPORT_LICENSE_END_DATE": queryResult.finalData[0].TRADE_OR_EXPORT_LICENSE_END_DATE,
            "TRADE_OR_EXPORT_LICENSE_FILE_NAME": queryResult.finalData[0].TRADE_OR_EXPORT_LICENSE_FILE_NAME,
            "TRADE_OR_EXPORT_LICENSE_ORIGINAL_FILE_NAME": queryResult.finalData[0].TRADE_OR_EXPORT_LICENSE_ORIGINAL_FILE_NAME,
            "ETIN_NUMBER": queryResult.finalData[0].ETIN_NUMBER,
            "ETIN_FILE_NAME": queryResult.finalData[0].ETIN_FILE_NAME,
            "ETIN_ORG_FILE_NAME": queryResult.finalData[0].ETIN_ORG_FILE_NAME,
            "EBIN_NUMBER": queryResult.finalData[0].EBIN_NUMBER,
            "EBIN_FILE_NAME": queryResult.finalData[0].EBIN_FILE_NAME,
            "EBIN_ORG_FILE_NAME": queryResult.finalData[0].EBIN_ORG_FILE_NAME,
            "TAX_RTN_ASSMNT_YEAR": queryResult.finalData[0].TAX_RTN_ASSMNT_YEAR,
            "TAX_RTN_ACKN_SLIP_FILE_NAME": queryResult.finalData[0].TAX_RTN_ACKN_SLIP_FILE_NAME,
            "TAX_RTN_ACKN_SLIP_ORIGINAL_FILE_NAME": queryResult.finalData[0].TAX_RTN_ACKN_SLIP_ORIGINAL_FILE_NAME
        }

    } else if (page == 2) {
        result.data = {
            "INCORPORATION_NUMBER": queryResult.finalData[0].INCORPORATION_NUMBER,
            "INCORPORATION_CIRTIFICATE_FILE_NAME": queryResult.finalData[0].INCORPORATION_CIRTIFICATE_FILE_NAME,
            "INCORPORATION_CIRTIFICATE_ORIGINAL_FILE_NAME": queryResult.finalData[0].INCORPORATION_CIRTIFICATE_ORIGINAL_FILE_NAME,

            "MEMORANDUM_ASSOCIATION_FILE_NAME": queryResult.finalData[0].MEMORANDUM_ASSOCIATION_FILE_NAME,
            "MEMORANDUM_ASSOCIATION_ORIGINAL_FILE_NAME": queryResult.finalData[0].MEMORANDUM_ASSOCIATION_ORIGINAL_FILE_NAME,

            "AUTHORIZED_SIGNS_FILE_NAME": queryResult.finalData[0].AUTHORIZED_SIGNS_FILE_NAME,
            "AUTHORIZED_SIGNS_ORIGINAL_FILE_NAME": queryResult.finalData[0].AUTHORIZED_SIGNS_ORIGINAL_FILE_NAME,

            "ARTICLE_ASSOCIATION_FILE_NAME": queryResult.finalData[0].ARTICLE_ASSOCIATION_FILE_NAME,
            "ARTICLE_ASSOCIATION_ORIGINAL_FILE_NAME": queryResult.finalData[0].ARTICLE_ASSOCIATION_ORIGINAL_FILE_NAME,

            "PROMINENT_CLIENTS_FILE_NAME": queryResult.finalData[0].PROMINENT_CLIENTS_FILE_NAME,
            "PROMINENT_CLIENTS_ORIGINAL_FILE_NAME": queryResult.finalData[0].PROMINENT_CLIENTS_ORIGINAL_FILE_NAME,
        }

    } else if (page == 3) {
        result.data = {
            "GOODS_LIST_FILE_NAME": queryResult.finalData[0].GOODS_LIST_FILE_NAME,
            "GOODS_LIST_ORG_FILE_NAME": queryResult.finalData[0].GOODS_LIST_ORG_FILE_NAME,

            "COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME": queryResult.finalData[0].COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME,
            "COMPANY_BANK_SOLVENCY_CIRTIFICATE_ORIGINAL_FILE_NAME": queryResult.finalData[0].COMPANY_BANK_SOLVENCY_CIRTIFICATE_ORIGINAL_FILE_NAME,

            "EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME": queryResult.finalData[0].EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME,
            "EXCELLENCY_SPECIALIED_CIRTIFICATE_ORIGINAL_FILE_NAME": queryResult.finalData[0].EXCELLENCY_SPECIALIED_CIRTIFICATE_ORIGINAL_FILE_NAME,

            "RECOMMENDATION_CIRTIFICATE_FILE_NAME": queryResult.finalData[0].RECOMMENDATION_CIRTIFICATE_FILE_NAME,
            "RECOMMENDATION_CIRTIFICATE_ORIGINAL_FILE_NAME": queryResult.finalData[0].RECOMMENDATION_CIRTIFICATE_ORIGINAL_FILE_NAME,

            "COMPANY_PROFILE_FILE_NAME": queryResult.finalData[0].COMPANY_PROFILE_FILE_NAME,
            "COMPANY_PROFILE_ORIGINAL_FILE_NAME": queryResult.finalData[0].COMPANY_PROFILE_ORIGINAL_FILE_NAME,

            "QA_CIRTIFICATE_FILE_NAME": queryResult.finalData[0].QA_CIRTIFICATE_FILE_NAME,
            "QA_CIRTIFICATE_ORIGINAL_FILE_NAME": queryResult.finalData[0].QA_CIRTIFICATE_ORIGINAL_FILE_NAME,

            "ANNUAL_TURNOVER_FILE_NAME": queryResult.finalData[0].ANNUAL_TURNOVER_FILE_NAME,
            "ANNUAL_TURNOVER_ORIGINAL_FILE_NAME": queryResult.finalData[0].ANNUAL_TURNOVER_ORIGINAL_FILE_NAME,

        }


    } else if (page == 4) {

        result.data = {
            "MACHINE_MANPOWER_LIST_FILE_NAME": queryResult.finalData[0].MACHINE_MANPOWER_LIST_FILE_NAME,
            "MACHINE_MANPOWER_LIST_ORIGINAL_FILE_NAME": queryResult.finalData[0].MACHINE_MANPOWER_LIST_ORIGINAL_FILE_NAME,

            "BUSINESS_PREMISES_FILE_NAME": queryResult.finalData[0].BUSINESS_PREMISES_FILE_NAME,
            "BUSINESS_PREMISES_ORIGINAL_FILE_NAME": queryResult.finalData[0].BUSINESS_PREMISES_ORIGINAL_FILE_NAME,

            "PROFILE_PIC1_FILE_NAME": queryResult.finalData[0].PROFILE_PIC1_FILE_NAME,
            "PROFILE_PIC1_ORIGINAL_FILE_NAME": queryResult.finalData[0].PROFILE_PIC1_ORIGINAL_FILE_NAME,

            "PROFILE_PIC2_FILE_NAME": queryResult.finalData[0].PROFILE_PIC2_FILE_NAME,
            "PROFILE_PIC2_ORIGINAL_FILE_NAME": queryResult.finalData[0].PROFILE_PIC2_ORIGINAL_FILE_NAME,

        }


    }


    return res.status(200).send(result);

});

router.post('/add', [verifyToken], async (req, res) => {

    let userId = req.decoded.USER_ID; // now fix, but it will dynamic;
    let id = 0;
    let page = [1, 2, 3, 4, "1", "2", "3", "4"].includes(req.body.page_no) ? req.body.page_no : 1;
    let willUpdate = false;
    let finalData = {};
    let currentTime = await commonObject.getTodayDateTime();

    let queryResult = await supplierDocumentModel.getDataByWhereCondition(
        { "user_id": userId }, { "id": "DESC" }, 1, 0, ["id"]
    );

    if (!isEmpty(queryResult) && !isEmpty(queryResult.rows)) {
        willUpdate = true;
        for (const orgRow of queryResult.rows) { id = orgRow[0]; break; }
    }


    if (page == 1) {

        let reqData = {
            "TRADE_OR_EXPORT_LICENSE_NUMBER": req.body.trade_or_export_license_number,
            "TRADE_OR_EXPORT_LICENSE_START_DATE": req.body.trade_or_export_license_start_date,
            "TRADE_OR_EXPORT_LICENSE_END_DATE": req.body.trade_or_export_license_end_date,
            "ETIN_NUMBER": req.body.etin_number,
            "EBIN_NUMBER": req.body.ebin_number,
            "TAX_RTN_ASSMNT_YEAR": req.body.tax_rtn_assmnt_year,
        }

        // if (!isEmpty(reqData.TRADE_OR_EXPORT_LICENSE_NUMBER)) {
        //     let validateId = await commonObject.checkItsNumber(reqData.TRADE_OR_EXPORT_LICENSE_NUMBER);
        //     if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "Trade or export license number should be number." });
        //     finalData.TRADE_OR_EXPORT_LICENSE_NUMBER = validateId.data;
        // }

        finalData.TRADE_OR_EXPORT_LICENSE_NUMBER = reqData.TRADE_OR_EXPORT_LICENSE_NUMBER;


        //  date related validation
        if (!isEmpty(reqData.TRADE_OR_EXPORT_LICENSE_START_DATE)) {

            let startDate = moment(reqData.TRADE_OR_EXPORT_LICENSE_START_DATE)
            if (startDate.isValid() == false) return res.status(400).send({ "success": false, "status": 400, "message": "Invalid trade or export license start date. " });


            if (isEmpty(reqData.TRADE_OR_EXPORT_LICENSE_END_DATE)) {
                return res.status(400).send({ "success": false, "status": 400, "message": "Please give trade or export license end date. " });
            } else {

                let endDate = moment(reqData.TRADE_OR_EXPORT_LICENSE_END_DATE)
                if (endDate.isValid() == false) return res.status(400).send({ "success": false, "status": 400, "message": "Invalid trade or export license end date. " });

                let dateCompareResult = await commonObject.compareTwoDate(reqData.TRADE_OR_EXPORT_LICENSE_START_DATE, reqData.TRADE_OR_EXPORT_LICENSE_END_DATE, false);
                if (dateCompareResult.days > 0) return res.status(400).send({ "success": false, "status": 400, "message": "trade or export license start date should be less than or equal today." });

                finalData.TRADE_OR_EXPORT_LICENSE_START_DATE = new Date(startDate);
                finalData.TRADE_OR_EXPORT_LICENSE_END_DATE = new Date(endDate);
            }
        }

        if (!isEmpty(reqData.ETIN_NUMBER)) {
            // let validateId = await commonObject.checkItsNumber(reqData.ETIN_NUMBER);
            // if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "Etin should be number." });
            // finalData.ETIN_NUMBER = validateId.data;
            finalData.ETIN_NUMBER = reqData.ETIN_NUMBER;
        }

       

        if (!isEmpty(reqData.EBIN_NUMBER)) {
            // let validateId = await commonObject.checkItsNumber(reqData.EBIN_NUMBER);
            // if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "Ebin should be number." });
            // finalData.EBIN_NUMBER = validateId.data;
            finalData.EBIN_NUMBER = reqData.EBIN_NUMBER;
        }

        


        
        //TAX_RTN_ASSMNT_YEAR

       if (!isEmpty(reqData.TAX_RTN_ASSMNT_YEAR)) {

           // let dateValidate = moment(reqData.TAX_RTN_ASSMNT_YEAR)
            //if (dateValidate.isValid() == false) return res.status(400).send({ "success": false, "status": 400, "message": "Invalid tax rtn assessment year. " });


            if (isEmpty(reqData.TAX_RTN_ASSMNT_YEAR))
                return res.status(400).send({ "success": false, "status": 400, "message": "Please give tax rtn assessment year. " });

            finalData.TAX_RTN_ASSMNT_YEAR = reqData.TAX_RTN_ASSMNT_YEAR;

       }



        if (req.files && Object.keys(req.files).length > 0 && req.files.trade_or_export_license_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "tradeOrExportLicense",
                "trade_or_export_license_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.TRADE_OR_EXPORT_LICENSE_FILE_NAME = fileUploadCode.fileName;
            finalData.TRADE_OR_EXPORT_LICENSE_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }




        if (req.files && Object.keys(req.files).length > 0 && req.files.etin_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "etinFile",
                "etin_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.ETIN_FILE_NAME = fileUploadCode.fileName;
            finalData.ETIN_ORG_FILE_NAME = fileUploadCode.fileOriginalName;
        }


        if (req.files && Object.keys(req.files).length > 0 && req.files.ebin_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "ebinFile",
                "ebin_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })


            finalData.EBIN_FILE_NAME = fileUploadCode.fileName;
            finalData.EBIN_ORG_FILE_NAME = fileUploadCode.fileOriginalName;
        }


        if (req.files && Object.keys(req.files).length > 0 && req.files.tax_rtn_ackn_slip_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "taxRtnAcknSlipFile",
                "tax_rtn_ackn_slip_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })


            finalData.TAX_RTN_ACKN_SLIP_FILE_NAME = fileUploadCode.fileName;
            finalData.TAX_RTN_ACKN_SLIP_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }

    } else if (page == 2) {


        if (!isEmpty(req.body.incorporation_number)) {
            // let validateId = await commonObject.checkItsNumber(req.body.incorporation_number);
            // if (validateId.success == false) return res.status(400).send({ "success": false, "status": 400, "message": "Incorporation number value should be number." });
            // finalData.INCORPORATION_NUMBER = validateId.data;
            finalData.INCORPORATION_NUMBER = req.body.incorporation_number;
        }

        



        if (req.files && Object.keys(req.files).length > 0 && req.files.incorporation_cirtificate_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "incorporationCirtificateFile",
                "incorporation_cirtificate_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.INCORPORATION_CIRTIFICATE_FILE_NAME = fileUploadCode.fileName;
            finalData.INCORPORATION_CIRTIFICATE_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }



        if (req.files && Object.keys(req.files).length > 0 && req.files.memorandum_association_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "memorandumAssociationFile",
                "memorandum_association_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.MEMORANDUM_ASSOCIATION_FILE_NAME = fileUploadCode.fileName;
            finalData.MEMORANDUM_ASSOCIATION_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }


        if (req.files && Object.keys(req.files).length > 0 && req.files.authorized_signs_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "authorizedSignsFile",
                "authorized_signs_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.AUTHORIZED_SIGNS_FILE_NAME = fileUploadCode.fileName;
            finalData.AUTHORIZED_SIGNS_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }


        if (req.files && Object.keys(req.files).length > 0 && req.files.article_association_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "articleAssociationFile",
                "article_association_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.ARTICLE_ASSOCIATION_FILE_NAME = fileUploadCode.fileName;
            finalData.ARTICLE_ASSOCIATION_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }


        if (req.files && Object.keys(req.files).length > 0 && req.files.prominent_clients_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "prominentClientsFile",
                "prominent_clients_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.PROMINENT_CLIENTS_FILE_NAME = fileUploadCode.fileName;
            finalData.PROMINENT_CLIENTS_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }

    } else if (page == 3) {

        if (req.files && Object.keys(req.files).length > 0 && req.files.goods_list_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "goodsListFile",
                "goods_list_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.GOODS_LIST_FILE_NAME = fileUploadCode.fileName;
            finalData.GOODS_LIST_ORG_FILE_NAME = fileUploadCode.fileOriginalName;
        }

        if (req.files && Object.keys(req.files).length > 0 && req.files.company_bank_solvency_cirtificate_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "companyBankSolvencyCirtificateFile",
                "company_bank_solvency_cirtificate_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.COMPANY_BANK_SOLVENCY_CIRTIFICATE_FILE_NAME = fileUploadCode.fileName;
            finalData.COMPANY_BANK_SOLVENCY_CIRTIFICATE_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }

        if (req.files && Object.keys(req.files).length > 0 && req.files.excellency_specialied_cirtificate_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "excellencySpecialiedCirtificateFile",
                "excellency_specialied_cirtificate_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.EXCELLENCY_SPECIALIED_CIRTIFICATE_FILE_NAME = fileUploadCode.fileName;
            finalData.EXCELLENCY_SPECIALIED_CIRTIFICATE_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }

        if (req.files && Object.keys(req.files).length > 0 && req.files.recommendation_cirtificate_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "recommendationCirtificateFile",
                "recommendation_cirtificate_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.RECOMMENDATION_CIRTIFICATE_FILE_NAME = fileUploadCode.fileName;
            finalData.RECOMMENDATION_CIRTIFICATE_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }

        if (req.files && Object.keys(req.files).length > 0 && req.files.company_profile_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "companyProfileFile",
                "company_profile_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.COMPANY_PROFILE_FILE_NAME = fileUploadCode.fileName;
            finalData.COMPANY_PROFILE_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }

        if (req.files && Object.keys(req.files).length > 0 && req.files.qa_cirtificate_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "qaCirtificateFile",
                "qa_cirtificate_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.QA_CIRTIFICATE_FILE_NAME = fileUploadCode.fileName;
            finalData.QA_CIRTIFICATE_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }

        if (req.files && Object.keys(req.files).length > 0 && req.files.annual_turnover_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "annualTurnoverFile",
                "annual_turnover_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.ANNUAL_TURNOVER_FILE_NAME = fileUploadCode.fileName;
            finalData.ANNUAL_TURNOVER_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }

    } else if (page == 4) {



        if (req.files && Object.keys(req.files).length > 0 && req.files.machine_manpower_list_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "machineManpowerListFile",
                "machine_manpower_list_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.MACHINE_MANPOWER_LIST_FILE_NAME = fileUploadCode.fileName;
            finalData.MACHINE_MANPOWER_LIST_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }

        if (req.files && Object.keys(req.files).length > 0 && req.files.business_premises_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "businessPremisesFile",
                "business_premises_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.BUSINESS_PREMISES_FILE_NAME = fileUploadCode.fileName;
            finalData.BUSINESS_PREMISES_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }

        if (req.files && Object.keys(req.files).length > 0 && req.files.profile_pic1_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "profilePic1File",
                "profile_pic1_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.PROFILE_PIC1_FILE_NAME = fileUploadCode.fileName;
            finalData.PROFILE_PIC1_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }

        if (req.files && Object.keys(req.files).length > 0 && req.files.profile_pic2_file) {
            let fileUploadCode = {};

            fileUploadCode = await fileUploaderCommonObject.uploadFile(
                req,
                "profilePic2File",
                "profile_pic2_file"
            );

            if (fileUploadCode.success == false) return res.status(400).send({ success: false, status: 400, message: fileUploadCode.message, })

            finalData.PROFILE_PIC2_FILE_NAME = fileUploadCode.fileName;
            finalData.PROFILE_PIC2_ORIGINAL_FILE_NAME = fileUploadCode.fileOriginalName;
        }


    }




    finalData.LAST_UPDATED_BY = userId;
    finalData.LAST_UPDATE_DATE = currentTime;


    if (willUpdate) {
        if (isEmpty(finalData)) return res.status(200).send({ "success": true, "status": 200, "message": "Update successfully done." });

        // update 
        let result = await supplierDocumentModel.updateById(id, finalData);
        if (!result || result.rowsAffected == undefined || result.rowsAffected < 1)
            return res.status(500).send({ "success": false, "status": 500, "message": "Something Wrong in system database." });


    } else {

        finalData.USER_ID = userId;
        finalData.CREATED_BY = userId;
        finalData.CREATION_DATE = currentTime;

        let result = await supplierDocumentModel.addNew(finalData);
        if (!result || result.rowsAffected == undefined || result.rowsAffected < 1)
            return res.status(500).send({ "success": false, "status": 500, "message": "Something Wrong in system database." });
    }

    return res.status(200).send({
        "success": true,
        "status": 200,
        "message": willUpdate ? "Supplier document update successfully done" : "Supplier document successfully add."
    });


});

module.exports = router;