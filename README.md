# **Scalable-Task-Management-API**
A backend API for a task management app with role-based access (Admin / User), with features like `task creation`, `updates`, `deadlines` & `notifications`.
This project is a backend system for managing tasks with user authentication, role-based access control & real-time notifications. It is built with **Node.js**, **TypeScript**, & **MongoDB**. The API supports user management, tasks management and real-time notifications using **Socket.IO**.

## Features
1. **User Management**
    - Register as a user or admin.
    - Login with email and password.
    - Role-based access control.

2. **Task Management**
    - Create, retrieve, update & delete tasks.
    - Assign tasks to users.
    - Filter tasks by status or assigned users.

3. **Real-time Notifications**
    - Notify users about approaching deadlines or status updates.


## Tech Stack
    - Language: TypeScript
    - Framework: Express.js
    - Database: MongoDB (via Mongo ODM)
    - Real-time Communication: Socket.io
    - Testing: Jest & Supertest

## Installation
### Follow these steps to setup and run the project on your local machine.

1. **Clone the repository:**
    ```bash
        git clone https://github.com/your-username/Scalable_Task_Management_API.git
        cd Scalable_Task_Management_API

2. **Install dependencies:**
    `npm install`

3. **Create a .env file in the root directory and configure the following variables:**
    ```bash
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/task_management
        JWT_SECRET=your_jwt_secret

4. **Build the project:**
    `npm run build`

5. **Start the server:**
    `npm start`

6. **Run tests:**
    `npm test`


## API Endpoints
### Authentication

| Method    | EndPoint                 | Description          | Access    |
|-----------|--------------------------|----------------------|-----------|
| POST      | /api/auth/registerUser   | registers a new user | Public    |
| POST      | /api/auth/loginUser      | Login and get a token| Public    |
| PATCH     | /api/auth/users/:id/role | updates user role,   | Admin     |
|           |                          | giving user admin    |           |
|           |                          | access               |           |
| GET       | /api/auth/getAllUsers    | fetch all users data | Admin     |
| GET       | /api/auth/getUser/:id    | fetch user by ID     | Admin     |
| DELETE    | /api/auth/deleteUser/:id | delete user by ID    | Admin     |
|-----------|--------------------------|----------------------|-----------|


### Task Management

| Method    | EndPoint                 | Description          | Access     |
|-----------|--------------------------|----------------------|------------|
| POST      | /api/tasks/createTask    | creates a new task   | User/Admin |
| GET       | /api/tasks/getTasks      | fetch all tasks      | User/Admin |
| GET       | /api/tasks/getTask/:id   | get Task by ID       | User/Admin |
| PUT       | /api/tasks/updateTask/:id| update task status   | User/Admin |
| Delete    | /api/tasks/deleteTask/:id| delete task by ID    | User/Admin |
|-----------|--------------------------|----------------------|------------|

## Folder Structure
    ```bash
    project-root/
    |--client/
    |  |--index.html
    |  |--index.js
    |--src/
    |  |--controllers/  # Logic for handling routes
    |  |--middlewares/  # Authentication & Validation middleware
    |  |--models/       # Mongoose models
    |  |--routes/       # API route definitions
    |  |--utils/        # Utility functions (e.g. token generation)
    |  |--types/        # Custom types
    |  |--config/       # Database configuration
    |  |--__tests__/    # Unit & Integration tests
    |  |--server.ts     # Main server setup
    |--dist/            # Compiled TypeScript files
    |--package.json     # Project metadata & scripts
    |--tsconfig.json    # TypeScript configuration
    |--jest.config.js   # Jest configuration
    |--README.md        # Project documentation