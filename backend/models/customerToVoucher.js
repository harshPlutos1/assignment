import { Model } from "objection";


class CustomerToVoucher extends Model {
    static get tableName() {
        return "customer_to_voucher";
    }
    

    static get jsonSchema(){
        return {
            type:"object",
            required:['customer_id', 'voucher_id'],
            properties : {
                id:{type:'integer'},
                customer_id:{type:'integer'},
                voucher_id:{type:'integer'},
                is_Redeemed:{type:'integer'}
            }
        }
    }

   
}

export default CustomerToVoucher;