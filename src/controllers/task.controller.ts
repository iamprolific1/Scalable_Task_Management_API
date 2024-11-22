import { Request, Response } from "express";
import { Task } from "../models/Task";
import { io } from "../server";

export const createTask = async(req: Request, res: Response)=> {
    const { title, description, status, priority, assignedTo } = req.body;

    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized! UserId not found" });
            return;
        }

        const task = new Task({ 
            title, 
            description, 
            status, 
            priority, 
            dueDate: Date.now() * 15 + 60 * 1000, 
            assignedTo: assignedTo || userId,
            createdBy: userId,
        });
        await task.save();
        io.emit('task-created', { message: "new task created", taskId: task._id, status: task.status })
        res.status(201).json({ message: "New task created successfully!" });
        return;
    } catch (error) {
        console.error("Error creating task for user: ", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}

export const getTasks = async(req: Request, res: Response)=> {
    try{
        const { user, status } = req.params;

        const filter: any = {}

        if (user) {
            filter.createdBy = user;
        }

        if (status) {
            filter.status = status;
        }

        const tasks = await Task.find(filter).populate("createdBy assignedTo", "username email role");
        io.emit('retrieve-tasks', { message: "Tasks retrieved successfully", tasks });
        res.status(200).json({ tasks, message: "Tasks retrieved successfully" });
        return;
    } catch(error) {
        console.error("Error retrieving tasks: ", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}

export const getTask = async(req: Request, res: Response)=> {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);

        if (!task) {
            res.status(404).json({ message: "Task with specified ID not found" });
            return;
        }

        io.emit('retrieve-task', { message: "Task found successfully!", task })
        res.status(200).json({ task, message: "Task found successfully!" });
        return;
    } catch (error) {
        console.error("Error retrieving task by ID: ", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}

export const updateTaskStatus = async(req: Request, res: Response)=> {
    const { id } = req.params;
    const { status } = req.body;
    try {

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(400).json({ message: "Invalid ID format" });
            return;
        }
        
        const task = await Task.findById(id);
        
        if (!task) {
            res.status(404).json({ message: "Task with specified ID not found" });
            return;
        }

        task.status = status;
        io.emit('update-task-status', { message: "Task status update", id: task._id, status: task.status})
        await task.save();
        res.status(200).json({ message: `Task status updated to ${status}`, task });
        return;
    } catch (error) {
        console.error("Error updating task status: ", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}


export const deleteTask = async(req: Request, res: Response)=> {
    const { id } = req.params;

    try {
        // validate ID format
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(400).json({ message: "Invalid ID format" });
            return;
        }

        const task = await Task.findById(id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return
        }

        await Task.findByIdAndDelete(id);
        io.emit('task-deleted', { message: "Task deleted successfully", id: id })
        res.status(200).json({ message: "Task deleted successfully" });
        return;
    } catch (error) {
        console.error("Error deleting task: ", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}