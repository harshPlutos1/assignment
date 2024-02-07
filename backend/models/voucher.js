import { Model } from "objection";

class Voucher extends Model{

    static get tableName(){
        return "vouchers";
    }

    static get jsonSchema(){
        return {
            type:"object",
            // required:['name', 'email'],
            properties : {
                id:{type:'integer'},
                name:{type:'string', minLength: 1, maxLength: 25},
                start:{type:'string'},
                expiry: {type:'string'},
                coins: {type:'integer'},
                codes:{type:'string'},
                isActive:{type:'integer',default:1}
            }
        }
    }
}

export default Voucher;