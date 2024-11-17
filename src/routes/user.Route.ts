import express from "express";
import { registerUser, loginUser, updateUserRole } from '../controllers/user.controller';
import { protect, adminOnly } from '../middlewares/authMiddleware'

const router = express.Router();
router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.patch('/users/:id/role', protect, adminOnly, updateUserRole)

export default router;