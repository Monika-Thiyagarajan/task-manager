import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Menu, MenuItem, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import "../styles/tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [editTask, setEditTask] = useState({ id: "", taskName: "", description: "", dueDate: "" });
  const [openDelete, setOpenDelete] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Handle menu open/close for a specific row
  const handleMenuClick = (event, taskId) => {
    setMenuAnchor((prev) => ({ ...prev, [taskId]: event.currentTarget }));
  };

  const handleMenuClose = (taskId) => {
    setMenuAnchor((prev) => ({ ...prev, [taskId]: null }));
  };

  // Open Edit Task Modal
  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find((task) => task._id === taskId);
    if (taskToEdit) {
      setEditTask({
        id: taskToEdit._id,
        taskName: taskToEdit.taskName,
        description: taskToEdit.description,
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : "",
      });
      setOpenEdit(true);
    }
    handleMenuClose(taskId);
  };

  // Handle Input Change in Edit Modal
  const handleEditChange = (e) => {
    setEditTask({ ...editTask, [e.target.name]: e.target.value });
  };

  // Submit Updated Task
  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/tasks/${editTask.id}`, editTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // Refresh the table
      setOpenEdit(false); // Close modal
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Open Delete Confirmation Dialog
  const handleDeleteConfirm = (taskId) => {
    setTaskToDelete(taskId);
    setOpenDelete(true);
    handleMenuClose(taskId);
  };

  // Delete Task
  const handleDelete = async () => {
    if (!taskToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${taskToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // Refresh the table
      setOpenDelete(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Table Columns
  const columns = [
    { field: "id", headerName: "No", width: 70 },
    { field: "date", headerName: "Date & Time", width: 180 },
    { field: "taskName", headerName: "Task", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={(event) => handleMenuClick(event, params.row.taskId)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor[params.row.taskId]}
            open={Boolean(menuAnchor[params.row.taskId])}
            onClose={() => handleMenuClose(params.row.taskId)}
          >
            <MenuItem onClick={() => handleEdit(params.row.taskId)}>Edit</MenuItem>
            <MenuItem onClick={() => handleDeleteConfirm(params.row.taskId)}>Delete</MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  // Convert tasks data to match DataGrid format
  const rows = tasks.map((task, index) => ({
    id: index + 1, // Sequential numbering
    taskId: task._id, // Store actual MongoDB ID
    date: new Date(task.createdAt).toLocaleString(),
    taskName: task.taskName,
    description: task.description,
  }));

  return (
    <div className="tasks-container">
      <h2 className="tasks-title">Task Management</h2>
      <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight disableSelectionOnClick 
       />

      {/* Edit Task Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField label="Task Name" name="taskName" fullWidth margin="dense" value={editTask.taskName} onChange={handleEditChange} />
          <TextField label="Description" name="description" fullWidth margin="dense" value={editTask.description} onChange={handleEditChange} />
          <TextField label="Due Date" type="date" name="dueDate" fullWidth margin="dense" InputLabelProps={{ shrink: true }} value={editTask.dueDate} onChange={handleEditChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} color="secondary">Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">Update Task</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="secondary">Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Tasks;
