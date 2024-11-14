import mongoose, { Document, Schema } from "mongoose";

enum Role {
    Admin = 'Admin',
    User = 'User'
}
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
}

const userSchema: Schema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Role, default: Role.User },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);