const multer = require("multer");
const ApiError = require("../utils/apiError");

exports.uploadSingleImage = (fieldName) => {
  const multerStorage = multer.memoryStorage();

  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError(`file must be image only`, 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: fileFilter });

  return upload.single(fieldName);
};
