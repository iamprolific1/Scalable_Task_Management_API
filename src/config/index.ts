import { DbConfig, DbConnection } from "./dbConfig";
import dotenv from "dotenv";
dotenv.config();

const config: DbConfig = {
    uri: process.env.MONGO_URI || '',
};

const dbConnection = new DbConnection(config);

export async function runDBConnection() {
    try {
        await dbConnection.connect();
    } catch (error) {
        console.error("Error in application: ", error as Error);
    }
}