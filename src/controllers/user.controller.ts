import { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';
import { User } from '../models/User';

export const createUser = async (req: Request, res: Response, next: NextFunction)=> {
    const { username, email, password, role } = req.body;
    try{
        if (!username || !email || !password) {
            res.status(401).json({ message: "All data required!"});
        }

        const isUserExisting = await User.findOne({ email });
        if (isUserExisting) {
            res.status(409).json({ message: "This user already exists"});
            next();
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role,
            createdAt: Date.now()
        });
        await user.save();
        res.status(201).json({ user, message: "User created successfully"})

    } catch (error) {
        console.error("Error creating user: ", error as Error);
    }
}