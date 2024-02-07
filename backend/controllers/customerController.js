import Customer from "../models/customer.js";
import Voucher from "../models/voucher.js";
import CustomerToVoucher from "../models/customerToVoucher.js";

export const getCustomer = async (req, res) => {
  try {
    const id = req.query.id;

    const customer = await Customer.query().findById(id);
    if (customer) {
      res.status(200).json({
        message: "Customer Fetched",
        customer: customer,
      });
    } else {
      res.status(404).json({
        message: "User Not Found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.query();
    if (customers) {
      res.status(200).json({
        message: "Customer Fetched",
        customers: customers,
      });
    } else {
      res.status(404).json({
        message: "Customers Not Found",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id, name, email } = req.body;
    const updatedCustomer = await Customer.query()
      .findById(id)
      .patch({ name, email });
    if (updatedCustomer) {
      res.status(200).json({
        status: 200,
        message: "Customer Updated",
        isUpdated: updatedCustomer,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "User Not Found",
      });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const registerCustomer = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const customer = await Customer.query().insert({
      name,
      email,
      password,
    });
    console.log(customer);
    res
      .status(200)
      .send({ status: 200, message: "Registered", customer: customer });
  } catch (error) {
    res.status(500).send({ status: 500, message: error.message });
  }
};

// export const customerVouchers = async (req, res) => {
//   try {
//     const customerId = req.query.id;
//     const customer = await Customer.query().findById(customerId);
//     if (customer) {
//       const vouchers = await customer.$relatedQuery("vouchers");
//       res
//         .status(200)
//         .send({ status: 200, message: "All vouchers", vouchers: vouchers });
//     } else {
//       res.status(202).send({
//         status: 202,
//         message: "No vouchers found or user does'nt exists",
//       });
//     }
//   } catch (error) {
//     res.status(500).send({ status: 500, message: error.message });
//   }
// };

export const customerVouchers = async (req, res) => {
  try {
    const customerId = req.query.id;
    const vouchers = await Customer.query()
      .findById(customerId)
      .withGraphFetched("vouchers")
      .modifyGraph("vouchers", (builder) => {
        builder.whereExists(function () {
          this.select("*")
            .from("customer_to_voucher")
            .whereRaw("customer_to_voucher.voucher_id = vouchers.id")
            .where("is_redeemed", 1);
        });
      });

    if (vouchers) {
      res.status(200).send({
        status: 200,
        message: "All vouchers where is_redeemed is 1",
        vouchers: vouchers.vouchers,
      });
    } else {
      res.status(202).send({
        status: 202,
        message: "No vouchers found or user doesn't exist",
      });
    }
  } catch (error) {
    res.status(500).send({ status: 500, message: error.message });
  }
};

export const addVoucher = async (req, res) => {
  try {
    const { customer_id, voucher_id } = req.body;
    const customer = await Customer.query()
      .findById(customer_id)
      .withGraphFetched("vouchers");

    const isAssociated = customer.vouchers.find(
      (voucher) => voucher.id === voucher_id
    );

    var is_Redeemed = 0;
    const voucher = await Voucher.query().findById(voucher_id);
    if (req.body.hasOwnProperty("coins")) {
      const coins = req.body.coins;
      is_Redeemed = voucher.coins <= coins && customer.coins >= coins ? 1 : 0;
      if (is_Redeemed == 1) {
        await Customer.query()
          .findById(customer_id)
          .patch({coins:customer.coins - coins});
      }
    } else {
      const code = req.body.code;
      is_Redeemed = voucher.codes.includes(code) ? 1 : 0;
    }
    console.log(is_Redeemed, "Redeemed");

    if (!isAssociated) {
      const data = await CustomerToVoucher.query().insert({
        customer_id,
        voucher_id,
        is_Redeemed,
      });
      console.log(data);
      if (data) {
        return res
          .status(200)
          .send({ status: 200, message: "Voucher added", data: data });
      }
    } else {
      if (is_Redeemed == 1) {
        await CustomerToVoucher.query()
          .where("customer_id", customer_id)
          .andWhere("voucher_id", voucher_id)
          .patch({ is_redemmed: 1 });
          res
      .status(200)
      .send({ status: 200, message: "Voucher added to this customer" });
      }

    }

    res
      .status(202)
      .send({ status: 202, message: "Voucher already added to this customer" });
  } catch (error) {
    res.status(500).send({ status: 500, message: error.message });
  }
};
