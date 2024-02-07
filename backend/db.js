import { Model } from "objection";
import Knex from "knex";

const knex = Knex({
    client:'mysql',
    connection: {
        host:"localhost",
        user:"root",
        password:"",
        database:"assignment_db"
    }
})

Model.knex(knex);

export default knex;
