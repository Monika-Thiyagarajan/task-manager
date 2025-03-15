const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all task routes using authMiddleware
router.post('/', authMiddleware, createTask);       // Create a task
router.get('/', authMiddleware, getTasks);         // Get all tasks for the user
router.put('/:id', authMiddleware, updateTask);    // Update a specific task
router.delete('/:id', authMiddleware, deleteTask); // Delete a specific task


module.exports = router;
