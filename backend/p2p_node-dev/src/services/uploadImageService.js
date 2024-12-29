const AsyncHandler = require("express-async-handler");
const sharp = require("sharp");

const { uploadSingleImage } = require('../middleware/uploads');

// upload brand image
module.exports.uploadCBrandImage = uploadSingleImage("image");
// image processing middle to resize image size
module.exports.resizeImage = AsyncHandler(async ({ body, file }, res, next) => {
  const fileName = `image-${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}.jpg`;
  await sharp(file.buffer)
    .resize(800, 800)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`src/uploads/supplier/image/${fileName}`);
  //save the image path into database
  body.image = fileName;
  next();
});