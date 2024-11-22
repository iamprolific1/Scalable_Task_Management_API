import express from 'express';
import { createTask, getTasks, getTask, updateTaskStatus, deleteTask } from '../controllers/task.controller';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/createTask', protect, createTask);
router.get('/getTasks', protect, getTasks);
router.get('/getTask/:id', protect, getTask);
router.put('/updateTask/:id', protect, updateTaskStatus);
router.delete('/deleteTask/:id', protect, deleteTask);

export default router;
