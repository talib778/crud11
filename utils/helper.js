import multer from "multer";
import path from "path";
// Set up storage using diskStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
 cb(null,Date.now()+path.extname(file.originalname));
  }
});

// Create the multer instance with the defined storage
export const upload = multer({ storage: storage });

