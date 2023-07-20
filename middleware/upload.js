const multer = require("multer");
const path = require("node:path");

const uploadPath = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    const filename = `${req.user._id}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
