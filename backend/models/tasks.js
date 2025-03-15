const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link task to user
  taskName: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
