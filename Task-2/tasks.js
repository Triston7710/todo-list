const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// GET /api/tasks - Get all tasks for authenticated user
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/tasks - Create a new task
router.post('/', 
  protect,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = new Task({
        title: req.body.title,
        description: req.body.description || '',
        completed: req.body.completed || false,
        userId: req.user._id
      });

      const savedTask = await task.save();
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// PUT /api/tasks/:id - Update a task
router.put('/:id', 
  protect,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = await Task.findById(req.params.id);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Check if task belongs to user
      if (task.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }

      // Update fields
      if (req.body.title !== undefined) task.title = req.body.title;
      if (req.body.description !== undefined) task.description = req.body.description;
      if (req.body.completed !== undefined) task.completed = req.body.completed;
      task.updatedAt = Date.now();

      const updatedTask = await task.save();
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if task belongs to user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


