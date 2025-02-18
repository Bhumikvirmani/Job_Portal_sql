// import multer from "multer";

// const storage = multer.memoryStorage();
// export const singleUpload = multer({storage}).single("file");
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'media', 'uploads')); // specify the directory to save files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // save files with unique names
  }
});

export const singleUpload = multer({ storage }).single("file");

