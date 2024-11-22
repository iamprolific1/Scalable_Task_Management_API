import request from "supertest";
import { app } from "../server";
import mongoose from "mongoose";
import { User } from "../models/User";
import { generateToken } from "../controllers/user.controller";
import bcrypt from 'bcryptjs';

beforeAll(async()=> {
    // connecting to a test database
    const mongoUri = 'mongodb://localhost:27017/test';
    await mongoose.connect(mongoUri)
});

afterEach(async()=> {
    // deleting all documents in the test database
    await User.deleteMany({});
});

afterAll(async()=> {
    // disconnecting from the test database
    await mongoose.connection.close();
});

describe('Authentication Endpoints', ()=> {
    it('should register a new user', async()=> {
        const res = await request(app).post('/api/auth/registerUser').send({
            username: 'testUser',
            email: 'testUser@example.com',
            password: 'testPassword',
            // role: 'user'
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'user created successfully');
        expect(res.body).toHaveProperty('_id');
        expect(res.body.email).toBe('testUser@example.com');
    });

    it('should not register a user with the same email', async()=> {
        // Directly insert a mock user
        await User.create({
            username: 'testUser2',
            email: 'testUser@example.com',
            password: 'testPassword2',
            // role: 'user'
        });
        const res = await request(app).post('/api/auth/registerUser').send({
            username: 'testUser2',
            email: 'testUser@example.com',
            password: 'testPassword3',
            // role: 'user'
        });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'User is already registered');
    });

    it('should authenticate user account', async()=> {
        const hashedPassword = await bcrypt.hash('testPassword3', 10);
        await User.create({
            username: 'testUser3',
            email: 'testUser3@example.com',
            password: hashedPassword,
        });

        const res = await request(app).post('/api/auth/loginUser').send({
            email: 'testUser3@example.com',
            password: 'testPassword3',
        });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'User authenticated successfully');
    });

    it('should update user role from admin', async()=> {
        const user = await User.create({
            username: 'testUser4',
            email: 'testUser4@example.com',
            password: await bcrypt.hash('testPassword4', 10),
            role: 'User',
        });

        const admin = await User.create({
            username: 'adminUser',
            email: 'admin@example.com',
            password: await bcrypt.hash('adminPassword123', 10),
            role: 'Admin',
        });

        const token = generateToken(admin._id as string, admin.role);

        const res = await request(app)
            .patch(`/api/auth/users/${user._id}/role`)
            .set('Authorization', `Bearer ${token}`)
            .send({ role: 'Admin' })
        expect(res.status).toBe(200);
    });

    it('should get all users from database', async()=> {
        const user = await User.create({
            username: "testUser5",
            email: "testUser5@example.com",
            password: await bcrypt.hash("testPassword4", 10),
            role: "User",
        });

        const admin = await User.create({
            username: "adminUser",
            email: "admin@example.com",
            password: await bcrypt.hash("adminPassword123", 10),
            role: "Admin",
        });

        const token = generateToken(admin._id as string, admin.role);

        const res = await request(app).get('/api/auth/getAllUsers').set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', "Users data retrieved successfully");
    });

    it('should get user by ID', async()=> {
        const user = await User.create({
            username: "testUser6",
            email: "testUser6@example.com",
            password: await bcrypt.hash("testPassword4", 10),
            role: "User",
        });

        const admin = await User.create({
            username: "adminUser",
            email: "admin@example.com",
            password: await bcrypt.hash("adminPassword123", 10),
            role: "Admin",
        });

        const token = generateToken(admin._id as string, admin.role);

        const res = await request(app).get(`/api/auth/getUser/${user._id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', "User with specified ID found");
    });

    it('should delete user with specified ID', async()=> {
        const user = await User.create({
            username: "testUser7",
            email: "testUser7@example.com",
            password: await bcrypt.hash("testPassword4", 10),
            role: "User",
        });

        const admin = await User.create({
            username: "adminUser",
            email: "admin@example.com",
            password: await bcrypt.hash("adminPassword123", 10),
            role: "Admin",
        });

        const token = generateToken(admin._id as string, admin.role);

        const res = await request(app).delete(`/api/auth/deleteUser/${user._id}`).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    })
})