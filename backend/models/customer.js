import { Model } from "objection";
import Voucher from "./voucher.js";

class Customer extends Model {
    static get tableName() {
        return "customers";
    }
    
    static get nameColumn(){
        return "name";
    }

    static get emailColumn(){
        return "email";
    }

    static get jsonSchema(){
        return {
            type:"object",
            required:['name', 'email'],
            properties : {
                id:{type:'integer'},
                name:{type:'string', minLength: 1, maxLength: 25},
                email: {type:'string'},
                password: {type:'string'},
                coins:{type:'integer',default:500}
            }
        }
    }

    static get relationMappings() {
        return {
            vouchers: {
                relation: Model.ManyToManyRelation,
                modelClass: Voucher,
                join: {
                    from: "customers.id",
                    through: {
                        from: "customer_to_voucher.customer_id",
                        to: "customer_to_voucher.voucher_id"
                    },
                    to: "vouchers.id"
                }
            }
        };
    }
}

export default Customer;