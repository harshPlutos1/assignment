import express from "express";
import { getCustomer, registerCustomer, updateCustomer, customerVouchers, addVoucher, getCustomers } from "../controllers/customerController.js";

const router = express.Router();

router.get('/get', getCustomer)

router.get('/getAll', getCustomers)

router.post('/register', registerCustomer);

router.patch('/update', updateCustomer );

router.get('/vouchers', customerVouchers);

router.post('/voucher/add', addVoucher);

export default router
