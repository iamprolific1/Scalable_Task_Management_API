import express from "express";
import dotenv from "dotenv";
import { runDBConnection } from "./config";
import userRoute from './routes/user.Route';
dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', userRoute);


app.listen(process.env.PORT, ()=> {
    console.log(`server is running on port: ${process.env.PORT}`);
    runDBConnection();
})