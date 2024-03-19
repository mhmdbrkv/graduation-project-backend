const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const ApiError = require("../utils/apiError");

// 1) MemoryStorage
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

// 2) DiskStorage one image
exports.uploadOneImage = (fieldName, path) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
      cb(
        null,
        `${file.originalname}-${uniqueSuffix}.${file.mimetype.split("/")[1]}`
      );
    },
  });

  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError(`file must be image only`, 400), false);
    }
  };

  const upload = multer({ storage: storage, fileFilter: fileFilter });

  return upload.single(fieldName);
};

// DiskStorage one video
exports.uploadOneVideo = (fieldName, path) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
      cb(
        null,
        `${file.originalname}_${uniqueSuffix}.${file.mimetype.split("/")[1]}`
      );
    },
  });

  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("video")) {
      cb(null, true);
    } else {
      cb(new ApiError(`file must be video only`, 400), false);
    }
  };

  const upload = multer({ storage: storage, fileFilter: fileFilter });

  return upload.single(fieldName);
};
