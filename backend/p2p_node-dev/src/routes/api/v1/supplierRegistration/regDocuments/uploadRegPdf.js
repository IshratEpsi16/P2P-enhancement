const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const verifyToken = require('../../../../../middleware/jwtValidation');
const oracledb = require("oracledb");
const fs = require('fs');

// Configure Multer to store files in the 'uploads/supplier/image' directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', '..', '..','..','..', 'uploads', 'supplier', 'files','registrationDocuments');
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null,Date.now() + '-' + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
      fileSize: 100 * 1024 * 2, // Set the maximum file size limit here
    },
    // Define file filter and limits
    fileFilter: (req, file, cb) => {
      const allowedFileTypes = ['application/pdf']; // Allowed file types
      const maxFileSize = 100 * 1024 * 2; // 2 mb
      console.log(`file.size:${maxFileSize}`);
  
      if (!allowedFileTypes.includes(file.mimetype)) {
        let value = {
            message: 'Invalid file type. Only PDF are allowed.',
            status: 400
          };
        return cb({
          message: 'Invalid file type. Only PDF are allowed.',
          status: 400
        });
      }
  
    // if (file.size > maxFileSize) {
        
    //     return cb({
    //       message: 'File size exceeds the limit (1MB).',
    //       status: 400
    //     });
    //   }
  
      cb(null, true); // Accept the file
      
    },
    
});

// Define a route for file upload
router.post('/upload/registration/pdf', verifyToken,async (req, res, next) => {
  let connection;
  //Retrive the old filename from db
  try {

    connection = req.dbConnection; // Acquire a database connection
    // Step 1: Retrieve the old file name from the database
    const { SUPPLIER_ID } = req.user;
    const queryOldFileName = `SELECT ETIN_FILE_NAME,EBIN_FILE_NAME,BUSINESS_PREMISES_FILE_NAME FROM XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS WHERE SUPPLIER_ID = :SUPPLIER_ID`;
    const oldFileNameResult = await connection.execute(queryOldFileName, { SUPPLIER_ID });

    if (oldFileNameResult.rows.length > 0) {
      //const oldFileName = oldFileNameResult.rows[0][0];

      for (let i = 0; i < oldFileNameResult.rows.length; i++) {
        const oldFileNames = String(oldFileNameResult.rows[i]).split(','); // Split into an array
        oldFileNames.forEach((oldFileName) => {
          const filePathToDelete = path.join(__dirname, '..', '..', '..', '..','..', 'uploads', 'supplier', 'files', 'registrationDocuments', oldFileName.trim());
          fs.unlink(filePathToDelete, (err) => {
            if (err) {
              console.error('Error deleting old file:', err);
            }
          });
        });
      }
      
      

      // Step 2: Delete the old file from the folder
      
    }
    
  } catch(error) {
    console.error("Error executing Oracle query:", error);
    res.status(500).json({ error: "Database query error" });
  }
  // Handle the uploaded file here
  upload.fields([
    { name: 'etin_file', maxCount: 1 },
    { name: 'ebin_file', maxCount: 1 },
    { name: 'business_premises_file', maxCount: 1 }
  ])(req, res,async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (e.g., file size exceeded)
      let result = {
        message: `File size exceeds the limit.${err.field} ${err.message}`,
        status: 400,
      };
      return res.status(400).json(result);
    } else if (err) {
      // An unknown error occurred
      let result = {
        message: `${err.message}`,
        status: 400,
      };
      return res.status(500).json(result);
    }

    try {
      const SUPPLIER_ID = req.user.SUPPLIER_ID;
      const etinFileName = req.files['etin_file'][0].filename;
      const ebinFileName = req.files['ebin_file'][0].filename;
      const businessPremisesFileName = req.files['business_premises_file'][0].filename;

      connection = req.dbConnection; // Acquire a database connection
      const result = await connection.execute(
        ` DECLARE
        BEGIN
        UPDATE XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS 
        SET ETIN_FILE_NAME = :ETIN_FILE_NAME,
        EBIN_FILE_NAME = :EBIN_FILE_NAME,
        BUSINESS_PREMISES_FILE_NAME = :BUSINESS_PREMISES_FILE_NAME
        WHERE SUPPLIER_ID = :SUPPLIER_ID;
        COMMIT;
        END;`,
        {
          ETIN_FILE_NAME: etinFileName,
            EBIN_FILE_NAME: ebinFileName,
            BUSINESS_PREMISES_FILE_NAME: businessPremisesFileName,
            SUPPLIER_ID,
          
        }
      );

    } catch (error) {
      console.error("Error executing Oracle query:", error);
      res.status(500).json({ error: "Database query error" });
    } finally {
      // Ensure the connection is always closed, whether there was an error or not
      if (connection) {
        try {
          await connection.close(); // Close the connection
          console.log("Oracle Database connection closed.");
        } catch (err) {
          console.error("Error closing Oracle Database connection:", err);
        }
      }
    }
   
    let value = {
      message: 'File uploaded successfully.',
      status: 200
    };

    res.status(200).json(value);
  });
});

module.exports = router;




