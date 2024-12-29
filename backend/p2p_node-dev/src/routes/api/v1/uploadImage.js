const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const verifyToken = require('../../../middleware/jwtValidation');

// Configure Multer to store files in the 'uploads/supplier/image' directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', '..', '..', 'uploads', 'supplier', 'image');
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null,'image'+ Date.now() + '-' + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
      fileSize: 100 * 1024, // Set the maximum file size limit here
    },
    // Define file filter and limits
    fileFilter: (req, file, cb) => {
      const allowedFileTypes = ['image/jpeg', 'image/png']; // Allowed file types
      const maxFileSize = 100 * 1024; // 100 kb
      console.log(`file.size:${maxFileSize}`);
  
      if (!allowedFileTypes.includes(file.mimetype)) {
        let value = {
            message: 'Invalid file type. Only JPEG and PNG are allowed.',
            status: 400
          };
        return cb({
          message: 'Invalid file type. Only JPEG and PNG are allowed.',
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
router.post('/upload/image', verifyToken, (req, res, next) => {
  // Handle the uploaded file here
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (e.g., file size exceeded)
      let result = {
        message: `File size exceeds the limit. ${err.message}`,
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

    // If everything is fine, continue with your code
    const fileSize = req.file.size;
    let value = {
      message: 'File uploaded successfully.',
      status: 200
    };

    res.status(200).json(value);
  });
});

module.exports = router;
