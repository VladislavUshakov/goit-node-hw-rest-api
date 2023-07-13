const multer = require("multer");
const puth = require("node:path");

const uploadPuth = puth.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: uploadPuth,
  filename: (req, file, cb) => {
    const filename = `${req.user._id}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
