import mongoose, { Document, Schema } from "mongoose";


enum ToDoStatus {
    Todo = 'To Do',
    InProgress = 'In Progress',
    Completed = 'Completed',
}
export interface Itask extends Document {
    title: string;
    description: string;
    status: ToDoStatus;
    dueDate: Date;
    userId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const taskSchema: Schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ToDoStatus, default: ToDoStatus.Todo },
    dueDate: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
})

export const Task = mongoose.model<Itask>('Task', taskSchema);