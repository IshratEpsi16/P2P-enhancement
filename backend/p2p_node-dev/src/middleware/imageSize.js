const multer = require("multer");

// Custom middleware function to check file size
function checkFileSize(maxSize) {
  return (req, res, next) => {
    const upload = multer({
      storage: multer.memoryStorage(), // You can change this to a disk storage if needed
      limits: {
        fileSize: 100 * 1024, // Set the maximum file size limit here
      },
      fileFilter: function (req, file, cb) {
        if (file.size > maxSize) {
          let value = {
            message: `File size exceeds the limit 100 KB.`,
            status: 400,
          };
          return cb(value);
        }
        cb(null, true);
      },
    }).single("file"); // Adjust the field name if needed (e.g., 'pdf')

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred (e.g., file size exceeded)
        let value = {
          message: `File size exceeds the limit. ${err.message}`,
          status: 400,
        };
        return res.status(400).json(value);
      } 

     else if (err) {
        // A Multer error occurred (e.g., file size exceeded)
        let value = {
          message: `File size exceeds the limit. ${err.message}`,
          status: 400,
        };
        return res.status(400).json(value);
      } 
      

      // If everything is fine, continue to the next middleware or route
      next();
    });
  };
}

module.exports = checkFileSize;
