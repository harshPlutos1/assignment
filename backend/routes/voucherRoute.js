import Express from "express";
import { uploadVouchers, updateVoucher, getAllVouchers, getVoucher, deleteVoucherById } from "../controllers/voucherController.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = Express.Router();

router.post(
  "/upload",
  upload.single("excelFile"),
  function (req, res, next) {
    // Check if upload was successful
    if (!req.file) {
      // No file uploaded, handle error
      const error = new Error("No file uploaded");
      error.status = 400;
      //console.log(req)
      return next(error);
    }
    req.uploadedFileName = req.file.filename;
    // File uploaded successfully, continue to the next middleware
    next();
  },
  uploadVouchers
);

router.post("/update", updateVoucher);

router.get("/all", getAllVouchers)

router.get("/", getVoucher)

router.delete("/delete", deleteVoucherById)


export default router;
