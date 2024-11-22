import express from "express";
import { registerUser, loginUser, updateUserRole, getAllUsers, getUser, deleteUser } from '../controllers/user.controller';
import { protect, adminOnly } from '../middlewares/authMiddleware'

const router = express.Router();
router.post('/registerUser', registerUser);
router.post('/loginUser', loginUser);
router.patch('/users/:id/role', protect, adminOnly, updateUserRole);
router.get('/getAllUsers', protect, adminOnly, getAllUsers);
router.get('/getUser/:id', protect, adminOnly, getUser);
router.delete('/deleteUser/:id', protect, adminOnly, deleteUser);

export default router;