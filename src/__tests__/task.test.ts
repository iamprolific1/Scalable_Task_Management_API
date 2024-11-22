import request from 'supertest';
import { app } from '../server';
import { Task } from '../models/Task';
import { io, httpServer } from '../server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

beforeAll(async()=> {
    await mongoose.connect('mongodb://localhost:27017/test');
});

afterEach(async()=> {
    await Task.deleteMany({});
});

afterAll(async()=> {
    await mongoose.connection.close();
    await io.close(); 
    httpServer.close();
});

describe('Task api endpoints', ()=> {
    it('should create a task', async()=> {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzdjZjA5ZTRkZDhlMGZhYmUyZDdhOSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTczMjIzMjcwNiwiZXhwIjoxNzMyMjM2MzA2fQ.wniUDpDZAdbwkxsqAgVZV3cKxaNA8RWlqDDGSbia1Ro';
        const res = await request(app).post('/api/tasks/createTask').send({
            title: 'Test Task',
            description: 'This is a test task',
            status: 'In Progress',
            priority: "Medium",
        }).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'New task created successfully!');
    });

    it('should get all tasks', async()=> {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzdjZjA5ZTRkZDhlMGZhYmUyZDdhOSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTczMjIzMjcwNiwiZXhwIjoxNzMyMjM2MzA2fQ.wniUDpDZAdbwkxsqAgVZV3cKxaNA8RWlqDDGSbia1Ro';
        const res = await request(app).get('/api/tasks/getTasks').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', "Tasks retrieved successfully");
    });

    it('should get a single task', async()=> {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzdjZjA5ZTRkZDhlMGZhYmUyZDdhOSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTczMjIzMjcwNiwiZXhwIjoxNzMyMjM2MzA2fQ.wniUDpDZAdbwkxsqAgVZV3cKxaNA8RWlqDDGSbia1Ro';
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };

        const task = await Task.create({
            title: 'Test Task',
            description: 'This is a test task',
            status: 'In Progress',
            priority: "Medium",
            dueDate: Date.now() * 15 + 60 * 1000, 
            createdBy: decoded.id
        });

        const res = await request(app).get(`/api/tasks/getTask/${task._id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Task found successfully!");
    });

    it('should update task status', async()=> {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzdjZjA5ZTRkZDhlMGZhYmUyZDdhOSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTczMjIzMjcwNiwiZXhwIjoxNzMyMjM2MzA2fQ.wniUDpDZAdbwkxsqAgVZV3cKxaNA8RWlqDDGSbia1Ro';
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };

        const task = await Task.create({
            title: 'Test Task',
            description: 'This is a test task',
            status: 'In Progress',
            priority: "Medium",
            dueDate: Date.now() * 15 + 60 * 1000, 
            createdBy: decoded.id
        });

        const res = await request(app).put(`/api/tasks/updateTask/${task._id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });

    it('should delete a task', async()=> {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MzdjZjA5ZTRkZDhlMGZhYmUyZDdhOSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTczMjIzMjcwNiwiZXhwIjoxNzMyMjM2MzA2fQ.wniUDpDZAdbwkxsqAgVZV3cKxaNA8RWlqDDGSbia1Ro';
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };

        const task = await Task.create({
            title: 'Test Task',
            description: 'This is a test task',
            status: 'In Progress',
            priority: "Medium",
            dueDate: Date.now() * 15 + 60 * 1000, 
            createdBy: decoded.id
        });

        const res = await request(app).delete(`/api/tasks/deleteTask/${task._id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Task deleted successfully');
    });

    it('should test WebSocket functionality', async()=> {
        const client = require('socket.io-client');
        const socket = client(`http://localhost:${process.env.PORT}`);

        socket.on("connect", ()=> {
            console.log(`client connected: ${socket.id}`);
        });

        socket.emit("send-notification", { message: "This is a notification from the client" });

        socket.on("receive-notification", (data: any)=> {
            console.log("Notification received from server: ", data);
        });

        //wait for socket events

        await new Promise((resolve)=> setTimeout(resolve, 1000));
        socket.close();
    })
})