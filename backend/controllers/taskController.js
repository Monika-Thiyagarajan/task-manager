const Task = require('../models/tasks');

// ✅ Create a New Task
exports.createTask = async (req, res) => {
  try {
    const { taskName, description, dueDate } = req.body;
    
    const task = new Task({
      user: req.user, // Comes from authMiddleware
      taskName,
      description,
      dueDate
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Tasks for the Logged-in User
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user }).sort({ createdAt: -1 }); // Show latest first
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update a Task
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.user.toString() !== req.user) return res.status(401).json({ msg: 'Not authorized' });

    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a Task
exports.deleteTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.user.toString() !== req.user) return res.status(401).json({ msg: 'Not authorized' });

    await task.deleteOne({_id:req.params.id});
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
