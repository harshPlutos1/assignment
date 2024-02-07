import Express  from "express";
import Customer from "./models/customer.js";
import knex from "./db.js";
import customerRoute from "./routes/customerRoute.js"
import voucherRoute from "./routes/voucherRoute.js"


const app = Express();

app.use(Express.json())
app.use(Express.urlencoded({ extended: false}));

app.get("/", async (req, res) => {
    const customer = await Customer.query().insert({
        name:"Harsh Pal",
        email:"harshpal@plutos.one"
    })
    console.log(customer);
    res.send("Inserted");
})

app.use("/api/customer", customerRoute)
app.use("/api/voucher", voucherRoute)

app.listen(4040, () => {
    console.log("Hello server is working at port 4040")
})