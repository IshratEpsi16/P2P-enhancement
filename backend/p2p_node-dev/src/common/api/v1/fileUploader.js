const fs = require('fs');
const fileUpload = require('express-fileupload');
const isEmpty = require("is-empty");

const commonObject = require('./common');


var path = require("path");
require('dotenv').config();

// 1 KB  = 1024 BYTE 

let uploadFileFormate = [{
    fileType: "image",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png"],
    fileSavePath: process.env.image
},

{
    fileType: "file",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.document_file_path
},

{
    fileType: "chequeFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.supplier_check_file_path
},

{
    fileType: "signatureFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.supplier_signature_file_path
},

{
    fileType: "companySeal",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.supplier_company_seal_file_path
},
{
    fileType: "tradeOrExportLicense",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.trade_or_export_license_file_path
},

// new 
{
    fileType: "etinFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.etin_file_path
},

{
    fileType: "agentEtinFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.agent_etin_file_path
},

{
    fileType: "ebinFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.ebin_file_path
},

{
    fileType: "taxRtnAcknSlipFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.tax_rtn_ackn_slip_file_path
},

{
    fileType: "incorporationCirtificateFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.incorporation_cirtificate_file_path
},

{
    fileType: "memorandumAssociationFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.memorandum_association_file_path
},

{
    fileType: "authorizedSignsFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.authorized_signs_file_path
},

{
    fileType: "articleAssociationFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.article_association_file_path
},

{
    fileType: "prominentClientsFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.prominent_clients_file_path
},

{
    fileType: "annualTurnoverFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.annual_turnover_file_path
},

{
    fileType: "qaCirtificateFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.qa_cirtificate_file_path
},

{
    fileType: "companyProfileFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.company_profile_file_path
},

{
    fileType: "recommendationCirtificateFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.recommendation_cirtificate_file_path
},

{
    fileType: "excellencySpecialiedCirtificateFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.excellency_specialied_cirtificate_file_path
},

{
    fileType: "companyBankSolvencyCirtificateFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.company_bank_solvency_cirtificate_file_path
},

{
    fileType: "goodsListFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.goods_list_file_path
},


{
    fileType: "machineManpowerListFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.machine_manpower_list_file_path
},

{
    fileType: "businessPremisesFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.business_premises_file_path
},

{
    fileType: "profilePic1File",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png"],
    fileSavePath: process.env.profile_pic1_file_path
},

{
    fileType: "profilePic2File",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png"],
    fileSavePath: process.env.profile_pic2_file_path
},

{
    fileType: "nidOrPassportFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.nid_or_passport_file_path
},

{
    fileType: "signatureFile",
    maxSize: 5 * 1024, //  MB TO KB
    mimetype: ["pdf","jpg", "jpeg", "png"],
    fileSavePath: process.env.signature_file_path
},
{
    fileType: "profilePicture",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png"],
    fileSavePath: process.env.profile_pic_file_path
},

{
    fileType: "rfqHeaderFile",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png","docx","xlsx","csv","pdf"],
    fileSavePath: process.env.rfq_header_file_path
},

{
    fileType: "rfqBuyerFile",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png","docx","xlsx","csv","pdf"],
    fileSavePath: process.env.rfq_buyer_file_path
},

{
    fileType: "rfqHeaderTermFile",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png","docx","xlsx","csv","pdf"],
    fileSavePath: process.env.rfq_header_term_file_path
},

{
    fileType: "rfqBuyerLinesFile",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png","docx","xlsx","csv","pdf"],
    fileSavePath: process.env.rfq_buyer_lines_file_path
},
{
    fileType: "rfqSupplierLinesFile",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png","docx","xlsx","csv","pdf"],
    fileSavePath: process.env.rfq_supplier_lines_file_path
},
{
    fileType: "rfqSupplierTermFile",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png","docx","xlsx","csv","pdf"],
    fileSavePath: process.env.rfq_supplier_term_file_path
},

{
    fileType: "rfqBuyerTermFile",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png","docx","xlsx","csv","pdf"],
    fileSavePath: process.env.rfq_lines_file_path
},

{
    fileType: "rfqAllFile",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png","docx","xlsx","csv","pdf"],
    fileSavePath: process.env.rfq_all_file_path
},

{
    fileType: "po",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["pdf"],
    fileSavePath: process.env.po_file_path
},

{
    fileType: "BANNER_IMG",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png"],
    fileSavePath: process.env.banner_file_path
},

{
    fileType: "shipmentHeader",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png","docx","xlsx","csv","pdf"],
    fileSavePath: process.env.shipment_header_file_path
},

{
    fileType: "po",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["pdf"],
    fileSavePath: process.env.po_file_path
},

{
    fileType: "invoiceMushok",
    maxSize: 2 * 1024, //  MB TO KB
    mimetype: ["jpg", "jpeg", "png","docx","xlsx","csv","pdf"],
    fileSavePath: process.env.invoice_mushok_file_path
},


]

let uploadFile = async (req, fileTypeObjectName = "image", inputFieldName = "unknown") => {

    return new Promise(async (resolve, reject) => {

        try {

            // check file is exits or not
            if (isEmpty(req.files) || Object.keys(req.files).length < 1) {
                return resolve({
                    success: false,
                    message: "No files were uploaded."
                });
            }


            // get file condition check and get
            let tempFileFormate;

            for (let index = 0; index < uploadFileFormate.length; index++) {

                if (uploadFileFormate[index].fileType == fileTypeObjectName) {
                    tempFileFormate = uploadFileFormate[index];
                    break;
                }
            }

            if (tempFileFormate === undefined) {
                return resolve({
                    success: false,
                    message: "Unknown file type"
                });
            }

            // check input field name in exit or not 
            // if (!req.files.hasOwnProperty(inputFieldName)) {

            if (Object.keys(req.files).indexOf(inputFieldName) == -1) {
                return resolve({
                    success: false,
                    message: "Unknown request field name"
                });
            }



            // upload file location check, mime type and size
            let directory = __dirname.split("P2P_Node");
            let tempMimetype = req.files[inputFieldName].mimetype.split("/");
            tempMimetype = tempMimetype[tempMimetype.length - 1];

            if (tempFileFormate.mimetype.indexOf(tempMimetype) < 0) {
                return resolve({
                    success: false,
                    message: `Invalid file type for ${inputFieldName}. File type should be ${tempFileFormate.mimetype.join(" / ")}`
                });

            } else if (tempFileFormate.maxSize < (req.files[inputFieldName].size / 1024)) {
                return resolve({
                    success: false,
                    message: "File size is too large. Max limit is " + (tempFileFormate.maxSize / 1024) + " MB"
                });
            }


            sampleFile = req.files[inputFieldName];
            // let newFileName = Date.now() + '-' + sampleFile.name;
            let newFileName = Date.now() + '-' + await commonObject.randomStringGenerate(10) + "." + tempMimetype;
            uploadPath = directory[0] + '/P2P_Node/' + tempFileFormate.fileSavePath + newFileName;




            // check folder is exits or not, if not create new folder
            let tempFolderArray = ("P2P_Node/" + tempFileFormate.fileSavePath).split("/");
            let tempDirectoryPath = directory[0] + "/";
            console.log(tempFolderArray);

            for (let index = 0; index < tempFolderArray.length; index++) {
                tempDirectoryPath += tempFolderArray[index] + "/";

                if (!fs.existsSync(tempDirectoryPath)) {
                    fs.mkdirSync(tempDirectoryPath);
                }
            }

            // move file to upload folder
            sampleFile.mv(uploadPath, async function (err) {
                if (err) {
                    return resolve({
                        success: false,
                        message: err
                    });

                } else {

                    // Set file permissions after moving the file
                    fs.chmod(uploadPath, 0o775, (err) => {
                        if (err) {
                            console.error('Error setting file permissions:', err);
                        }
                    });

                    return resolve({
                        success: true,
                        message: "file uploaded successfully",
                        fileName: newFileName,
                        fileOriginalName: sampleFile.name
                    });

                }
            });

        } catch (error) {
            console.log(error)
            return resolve({
                success: false,
                message: "Catch Error",
                error: error
            });
        }
    });
}

let fileRemove = async (fileName = "", fileTypeObjectName = "image") => {


    return new Promise((resolve, reject) => {

        try {

            // get file condition check and get
            let tempFileFormate;

            for (let index = 0; index < uploadFileFormate.length; index++) {

                if (uploadFileFormate[index].fileType == fileTypeObjectName) {
                    tempFileFormate = uploadFileFormate[index];
                    break;
                }
            }

            if (tempFileFormate === undefined) {
                return resolve({
                    success: false,
                    message: "Unknown file type"
                });
            }


            // upload file location check, mime type and size
            let directory = __dirname.split("P2P_Node");
            let uploadPath = directory[0] + '/P2P_Node/' + tempFileFormate.fileSavePath + fileName;

            // console.log(uploadPath)
            // console.log(fileName)

            fs.chmodSync(directory[0] + '/P2P_Node/' + tempFileFormate.fileSavePath, '0777');
            fs.unlinkSync(uploadPath);

            return resolve({
                success: true,
                message: "file remove successfully done",
                fileName: fileName
            });

        } catch (error) {
            return resolve({
                success: false,
                message: "Catch file not remove.",
                error: error
            });
        }

    });
}



let fileRename = async (existingFileName = "", newFileName = "xcs", fileTypeObjectName = "image") => {


    return new Promise((resolve, reject) => {

        try {

            // get file condition check and get
            let tempFileFormate;

            for (let index = 0; index < uploadFileFormate.length; index++) {

                if (uploadFileFormate[index].fileType == fileTypeObjectName) {
                    tempFileFormate = uploadFileFormate[index];
                    break;
                }
            }

            if (tempFileFormate === undefined) {
                return resolve({
                    success: false,
                    message: "Unknown file type"
                });
            }


            // upload file location check, mime type and size
            let directory = __dirname.split("P2P_Node");
            let uploadPath = directory[0] + '/P2P_Node/' + tempFileFormate.fileSavePath;



            fs.chmodSync(directory[0] + '/P2P_Node/' + tempFileFormate.fileSavePath, '0444');
            fs.renameSync(uploadPath + existingFileName, uploadPath + newFileName);

            // console.log(uploadPath + existingFileName);

            return resolve({
                success: true,
                message: "file remove successfully done",
                fileName: newFileName
            });

        } catch (error) {
            return resolve({
                success: false,
                message: "Catch file not remove.",
                error: error
            });
        }

    });
}

let fileExitCheck = async (fileName = "", fileTypeObjectName = "image") => {


    return new Promise((resolve, reject) => {

        try {

            // get file condition check and get
            let tempFileFormate;

            for (let index = 0; index < uploadFileFormate.length; index++) {

                if (uploadFileFormate[index].fileType == fileTypeObjectName) {
                    tempFileFormate = uploadFileFormate[index];
                    break;
                }
            }

            if (tempFileFormate === undefined) {
                return resolve({
                    success: false,
                    message: "Unknown file type"
                });
            }

            let directory = __dirname.split("P2P_Node");
            let uploadPath = directory[0] + '/P2P_Node/' + tempFileFormate.fileSavePath;

            if (fs.existsSync(uploadPath + fileName)) {
                return resolve({
                    success: true,
                    message: "File exists"
                });
            } else {
                return resolve({
                    success: false,
                    message: "File not found"
                });
            }

        } catch (error) {
            return resolve({
                success: false,
                message: "Catch file not remove.",
                error: error
            });
        }

    });
}


let uploadBase64ToFile = async (file,mimetype, fileTypeObjectName = "image", inputFieldName = "unknown") => {

    return new Promise(async (resolve, reject) => {

        try {

             // Decode the base64 data
             let buffer = Buffer.from(file, "base64");


            // get file condition check and get
            let tempFileFormate;

            for (let index = 0; index < uploadFileFormate.length; index++) {

                if (uploadFileFormate[index].fileType == fileTypeObjectName) {
                    tempFileFormate = uploadFileFormate[index];
                    break;
                }
            }

            if (tempFileFormate === undefined) {
                return resolve({
                    success: false,
                    message: "Unknown file type"
                });
            }

            // check input field name in exit or not 
            // if (!req.files.hasOwnProperty(inputFieldName)) {

            // if (Object.keys(req.files).indexOf(inputFieldName) == -1) {
            //     return resolve({
            //         success: false,
            //         message: "Unknown request field name"
            //     });
            // }


        // Get the size of the binary data in bytes
        const fileSizeInBytes = buffer.length;

        // Convert the size to kilobytes (optional)
        const fileSizeInKB = fileSizeInBytes / 1024;


            // upload file location check, mime type and size
            let directory = __dirname.split("P2P_Node");
            // let tempMimetype = req.files[inputFieldName].mimetype.split("/");
            // tempMimetype = tempMimetype[tempMimetype.length - 1];

            if (!tempFileFormate.mimetype.includes(mimetype)) {
                return resolve({
                    success: false,
                    message: `Invalid file type for ${inputFieldName}. File type should be ${tempFileFormate.mimetype.join(" / ")}`
                });

            } else if (tempFileFormate.maxSize < fileSizeInKB) {
                return resolve({
                    success: false,
                    message: "File size is too large. Max limit is " + (tempFileFormate.maxSize / 1024) + " MB"
                });
            }


            //sampleFile = req.files[inputFieldName];
            // let newFileName = Date.now() + '-' + sampleFile.name;
            let newFileName = Date.now() + '-' + await commonObject.randomStringGenerate(10) + "." + mimetype;
            uploadPath = directory[0] + '/P2P_Node/' + tempFileFormate.fileSavePath + newFileName;




            // check folder is exits or not, if not create new folder
            let tempFolderArray = ("P2P_Node/" + tempFileFormate.fileSavePath).split("/");
            let tempDirectoryPath = directory[0] + "/";

            for (let index = 0; index < tempFolderArray.length; index++) {
                tempDirectoryPath += tempFolderArray[index] + "/";

                if (!fs.existsSync(tempDirectoryPath)) {
                    fs.mkdirSync(tempDirectoryPath);
                }
            }

            try {
               
                // Write the file synchronously
                fs.writeFileSync(uploadPath, buffer);
                console.log(
                  "File saved successfully:"
                );
                return resolve({
                    success: true,
                    message: "file uploaded successfully",
                    fileName: newFileName,
                    fileOriginalName: 'sampleFile.name'
                });
                // Respond to the client if needed
                // res.send("File uploaded and saved successfully");
              } catch (err) {
                console.error("Error saving file:", err);
                return resolve({
                    success: false,
                    message: err
                });
                // Handle the error and respond to the client if needed
                // return res.status(500).send("Error saving file");
              }

            // move file to upload folder
            // sampleFile.mv(uploadPath, async function (err) {
            //     if (err) {
            //         return resolve({
            //             success: false,
            //             message: err
            //         });

            //     } else {

            //         // Set file permissions after moving the file
            //         // fs.chmod(uploadPath, 0o777, (err) => {
            //         //     if (err) {
            //         //         console.error('Error setting file permissions:', err);
            //         //     }
            //         // });

            //         return resolve({
            //             success: true,
            //             message: "file uploaded successfully",
            //             fileName: newFileName,
            //             fileOriginalName: sampleFile.name
            //         });

            //     }
            // });

        } catch (error) {
            console.log(error)
            return resolve({
                success: false,
                message: "Catch Error",
                error: error
            });
        }
    });
}

let uploadLineFile = async (file, fileTypeObjectName = "image", inputFieldName = "unknown") => {

    return new Promise(async (resolve, reject) => {

        try {

            // check file is exits or not
            if (isEmpty(file)) {
                return resolve({
                    success: false,
                    message: "No files exist."
                });
            }


            // get file condition check and get
            let tempFileFormate;

            for (let index = 0; index < uploadFileFormate.length; index++) {

                if (uploadFileFormate[index].fileType == fileTypeObjectName) {
                    tempFileFormate = uploadFileFormate[index];
                    break;
                }
            }

            if (tempFileFormate === undefined) {
                return resolve({
                    success: false,
                    message: "Unknown file type"
                });
            }

            // check input field name in exit or not 
            // if (!req.files.hasOwnProperty(inputFieldName)) {

            if (Object.keys(file).indexOf(inputFieldName) == -1) {
                return resolve({
                    success: false,
                    message: "Unknown request field name"
                });
            }



            // upload file location check, mime type and size
            let directory = __dirname.split("P2P_Node");
            let tempMimetype = req.files[inputFieldName].mimetype.split("/");
            tempMimetype = tempMimetype[tempMimetype.length - 1];

            if (tempFileFormate.mimetype.indexOf(tempMimetype) < 0) {
                return resolve({
                    success: false,
                    message: `Invalid file type for ${inputFieldName}. File type should be ${tempFileFormate.mimetype.join(" / ")}`
                });

            } else if (tempFileFormate.maxSize < (file[inputFieldName].size / 1024)) {
                return resolve({
                    success: false,
                    message: "File size is too large. Max limit is " + (tempFileFormate.maxSize / 1024) + " MB"
                });
            }


            sampleFile = file;
            // let newFileName = Date.now() + '-' + sampleFile.name;
            let newFileName = Date.now() + '-' + await commonObject.randomStringGenerate(10) + "." + tempMimetype;
            uploadPath = directory[0] + '/P2P_Node/' + tempFileFormate.fileSavePath + newFileName;




            // check folder is exits or not, if not create new folder
            let tempFolderArray = ("P2P_Node/" + tempFileFormate.fileSavePath).split("/");
            let tempDirectoryPath = directory[0] + "/";

            for (let index = 0; index < tempFolderArray.length; index++) {
                tempDirectoryPath += tempFolderArray[index] + "/";

                if (!fs.existsSync(tempDirectoryPath)) {
                    fs.mkdirSync(tempDirectoryPath);
                }
            }

            // move file to upload folder
            sampleFile.mv(uploadPath, async function (err) {
                if (err) {
                    return resolve({
                        success: false,
                        message: err
                    });

                } else {

                    // Set file permissions after moving the file
                    // fs.chmod(uploadPath, 0o777, (err) => {
                    //     if (err) {
                    //         console.error('Error setting file permissions:', err);
                    //     }
                    // });

                    return resolve({
                        success: true,
                        message: "file uploaded successfully",
                        fileName: newFileName,
                        fileOriginalName: sampleFile.name
                    });

                }
            });

        } catch (error) {
            console.log(error)
            return resolve({
                success: false,
                message: "Catch Error",
                error: error
            });
        }
    });
}

module.exports = {
    uploadFile,
    fileRemove,
    fileRename,
    fileExitCheck,
    uploadBase64ToFile,
    uploadLineFile,
}