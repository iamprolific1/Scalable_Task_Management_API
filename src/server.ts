import express from "express";
import dotenv from "dotenv";
import { runDBConnection } from "./config";
import userRoute from './routes/user.Route';
import taskRoute from './routes/task.Route';
dotenv.config();

export const app = express();
app.use(express.json());
app.use('/api/auth', userRoute);
app.use('/api/tasks', taskRoute);



app.listen(process.env.PORT, ()=> {
    console.log(`server is running on port: ${process.env.PORT}`);
    runDBConnection();
})