const cloudinary = require("../config/cloudinary");

exports.uploader = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    console.log("Upload success:", result);
    return result;
  } catch (err) {
    console.error("Err: ", err);
  }
};

exports.deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("File deleted from cloudinary: ", result);
  } catch (err) {
    console.err("Err: ", err);
  }
};
