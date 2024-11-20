import mongoose, { Document, Schema } from "mongoose";


enum ToDoStatus {
    Todo = 'To Do',
    InProgress = 'In Progress',
    Completed = 'Completed',
}

enum TaskPriority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}

export interface Itask extends Document {
    title: string;
    description: string;
    status: ToDoStatus;
    priority?: TaskPriority;
    dueDate?: Date;
    assignedTo: mongoose.Types.ObjectId;
    createdBy?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const taskSchema: Schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ToDoStatus, default: ToDoStatus.Todo },
    priority: { type: String, enum: TaskPriority, default: TaskPriority.Medium },
    dueDate: { type: Date, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true })

export const Task = mongoose.model<Itask>('Task', taskSchema);