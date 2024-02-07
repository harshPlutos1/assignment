import xlsx from "xlsx";
import { fileURLToPath } from "url";
import path from "path";
import Voucher from "../models/voucher.js";
import { log } from "console";

export const uploadVouchers = async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, "../uploads", req.uploadedFileName);
    const workbook = xlsx.readFile(filePath);
    
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON object
    const data = xlsx.utils.sheet_to_json(sheet);
    if (data) {
    //   await Voucher.query().delete();
      for (const row of data) {
        
        await Voucher.query().insert({
          name: row.Name,
          start: dateHandler(xlsx.SSF.parse_date_code(row.Start_Date)),
          expiry: dateHandler(xlsx.SSF.parse_date_code(row.Expiry_Date)),
          codes: row.Codes,
          coins: row.Coins,
          isActive: row.IsActive
        });
      }
    } else {
      res.json({
        status: 202,
        message: "Some error occured while uploading data",
      });
    }
    res.send(data);
  } catch (error) {
    res.json({ status: 404, message: error.message });
  }
};

export const updateVoucher = async (req, res) => {
  try {
    const { id } = req.body;
    const existingVoucher = await Voucher.query().findById(id);

    if (existingVoucher) {
      const updateObject = {};

      for (const key in req.body) {
        if (existingVoucher.hasOwnProperty(key)) {
          if (key === "codes") {
            updateObject[key] = [
              existingVoucher.codes.split(","),
              req.body[key],
            ].join(",");
          } else {
            updateObject[key] = req.body[key];
          }
        }
      }
      const updated = await Voucher.query().findById(id).patch(updateObject);
      if (updated == 1) {
        res.json({
          status: 200,
          message: "Voucher Updated",
        });
      }
    }
    res.json({
      status: 202,
      message: "Voucher Not Updated",
    });
  } catch (error) {
    res.json({ status: 404, message: error.message });
  }
};

export const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.query();
    if (vouchers) {
      res.json({
        status: 200,
        message: "Vouchers List",
        vouchers: vouchers,
      });
    } else {
      res.json({
        status: 202,
        message: "No Vouchers Available",
      });
    }
  } catch (error) {
    res.json({ status: 404, message: error.message });
  }
};

export const getVoucher = async (req, res) => {
  try {
    const vouchers = await Voucher.query().findById(req.query.id);
    if (vouchers) {
      res.json({
        status: 200,
        message: "Voucher",
        vouchers: vouchers,
      });
    } else {
      res.json({
        status: 202,
        message: "No Voucher Available",
      });
    }
  } catch (error) {
    res.json({ status: 404, message: error.message });
  }
};

export const deleteVoucherById = async (req, res) => {
    try {
      const id = req.query.id; 
      // Delete the voucher by ID
      const deletedCount = await Voucher.query().deleteById(id);
      
      if (deletedCount === 0) {
        // Handle case where voucher with the given ID is not found
        return res.status(404).json({ status:404, message: "Voucher not found" });
      }
  
      // Respond with success message
      res.status(200).json({ status:200,message: "Voucher deleted successfully" });
    } catch (error) {
      // Handle any errors
      res.status(500).json({status:500, message: error.message });
    }
  };
  

const dateHandler = (date) => {
  const year = date.y;
  const month = date.m - 1; // JS Date object uses 0-indexed months (0 for January)
  const day = date.d;

  // Create a new Date object using the extracted components
  const jsDate = new Date(year, month, day);
//   console.log(jsDate);
  return jsDate.toISOString();
};
