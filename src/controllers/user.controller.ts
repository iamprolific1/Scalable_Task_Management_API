import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from "../models/User";

export const generateToken = (id: string, role: string)=> {
    return jwt.sign({id, role}, process.env.JWT_SECRET as string, { expiresIn: '1h' });
}

export const registerUser = async(req: Request, res: Response)=> {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(401).json({ message: "All data required" });
        return;
    }

    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(400).json({ message: "User is already registered" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword, role: 'User' });
        await user.save();
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id as string, user.role), message: "user created successfully"
        })

    } catch (error) {
        console.error("Error registering new user: ", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}

export const loginUser = async(req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(401).json({ message: "All field required" });
        return;
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const verifyPassword = await bcrypt.compare(password, user.password);
        if (!verifyPassword) {
            res.status(401).json({ message: "Invalid Credentials" });
            return
        }

        res.status(200).json({ 
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id as string, user.role), 
            message: "User authenticated successfully", 
        })
    } catch (error) {
        console.error("Error authenticating user: ", error);
        res.status(500).json({ message: "Internal Server Error" });
        return 
    }
}

export const updateUserRole  = async (req: Request, res: Response)=> {
    const { id } = req.params;
    const { role } = req.body;

    if(!['User', 'Admin'].includes(role)){
        res.status(403).json({ message: "Invalid role specified" });
        return;
    }

    try {
        const user = await User.findById(id);
        if(!user) {
            console.log("User not found")
            res.status(404).json({ message: 'User not found' });
            return
        }
        user.role = role;
        await user.save();
        res.status(200).json({ message: `user role is updated to ${role}`, user});
        return;
    } catch (error) {
        console.error("Error updating user role: ", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
}