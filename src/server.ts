import express from "express";
import dotenv from "dotenv";
import { runDBConnection } from "./config";
import userRoute from './routes/user.Route';
import bcrypt from 'bcryptjs';
dotenv.config();

export const app = express();
app.use(express.json());
app.use('/api/auth', userRoute);

const adminPassword = "Password123";

app.listen(process.env.PORT, ()=> {
    console.log(`server is running on port: ${process.env.PORT}`);
    // bcrypt.hash(adminPassword, 10).then(console.log)
    runDBConnection();
})