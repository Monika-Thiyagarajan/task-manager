import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import "../styles/tasks.css";
const MAX_DESCRIPTION_LENGTH = 100;
function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [tasksPerPage] = useState(5);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState({ id: "", taskName: "", description: "", dueDate: "" });
  const [newTask, setNewTask] = useState({ taskName: "", description: "", dueDate: "" });
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [errors, setErrors] = useState({});

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
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  const validateTask = (task) => {
    let errors = {};
    if (!task.taskName.trim()) errors.taskName = "Task name is required";
    if (!task.dueDate.trim()) errors.dueDate = "Due date is required";
    return errors;
  };

  const handleAddTask = async () => {
    const validationErrors = validateTask(newTask);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
      setShowAdd(false);
      setNewTask({ taskName: "", description: "", dueDate: "" });
      setErrors({});
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEdit = (task) => {
    setEditTask({
      id: task._id,
      taskName: task.taskName,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
    setShowEdit(true);
  };

  const handleUpdateTask = async () => {
    const validationErrors = validateTask(editTask);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/tasks/${editTask.id}`, editTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
      setShowEdit(false);
      setEditTask({ id: "", taskName: "", description: "", dueDate: "" });
      setErrors({});
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteConfirm = (taskId) => {
    setTaskToDelete(taskId);
    console.log(taskId)
    setShowDelete(true);
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${taskToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const updatedTasks = tasks.filter(task => task._id !== taskToDelete._id); // Remove deleted task
      setTasks(updatedTasks);
      setShowDelete(false);
      setTaskToDelete(null);
  
      // If the current page is now empty, go back to page 1
      const remainingTasksOnPage = updatedTasks.slice(
        (currentPage - 1) * tasksPerPage,
        currentPage * tasksPerPage
      );
      
      if (remainingTasksOnPage.length === 0 && currentPage > 1) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  
  // Calculate the tasks to be displayed on the current page
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="table-ontainer d-flex flex-column align-items-center" style={{ marginTop: "0" }}>
      {/* Add New button to top */}
      <div className="position-relative w-100">
        <button
          className="btn btn-primary position-absolute top-0 end-0 me-3 mt-3"
          onClick={() => setShowAdd(true)}
        >
          + Add Task
        </button>
      </div>

      {/* Add some padding to avoid overlap */}
      <div className="table-responsive w-100 mt-5" style={{ marginTop: "70px" }}>
        <table className="table mt-3 text-center">
          <thead>
            <tr>
              <th>No</th>
              <th>Date & Time</th>
              <th>Task</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.length > 0 ? (
              currentTasks.map((task, index) => (
                <tr key={task._id}>
                  <td>{(currentPage - 1) * tasksPerPage + index + 1}</td>
                  <td>{formatDate(task.createdAt)}</td>
                  <td
                    className="task-desc"

                  >
                    {task.taskName}
                  </td>
                  <td className="task-desc">{task.description}</td>
                  <td>
                    <div className="action-menu">
                      <span className="dots">⋮</span>
                      <div className="menu-options">
                        <button onClick={() => handleEdit(task)}>Edit</button>
                        <button className="text-danger" onClick={() => handleDeleteConfirm(task)}>Delete</button>
                      </div>
                    </div>
                  </td>
                  {/* <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(task)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteConfirm(task._id)}>Delete</button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No records found</td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
      <div className="d-flex justify-content-center mt-3">
  <button
    className="pagination-button ms-1"
    disabled={currentPage === 1}
    onClick={() => handlePageChange(currentPage - 1)}
  >
    &lt;
  </button>

  {/* Page Numbers */}
  {[...Array(totalPages)].map((_, index) => (
    <button
      key={index}
      className={`pagination-button ms-1 ${currentPage === index + 1 ? 'active' : ''}`}
      onClick={() => handlePageChange(index + 1)}
    >
      {index + 1}
    </button>
  ))}

  <button
    className="pagination-button ms-1"
    disabled={currentPage === totalPages}
    onClick={() => handlePageChange(currentPage + 1)}
  >
    &gt;
  </button>
</div>


      {(showAdd || showEdit) && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{showEdit ? "Edit Task" : "Add New Task"}</h5>
                <button className="btn-close" onClick={() => { setShowAdd(false); setShowEdit(false); }}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Task Name"
                  value={showEdit ? editTask.taskName : newTask.taskName}
                  onChange={(e) => showEdit ? setEditTask({ ...editTask, taskName: e.target.value }) : setNewTask({ ...newTask, taskName: e.target.value })}
                />
                {errors.taskName && <div className="text-danger">{errors.taskName}</div>}

                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  value={showEdit ? editTask.description : newTask.description}
                  onChange={(e) => showEdit ? setEditTask({ ...editTask, description: e.target.value }) : setNewTask({ ...newTask, description: e.target.value })}
                />
                {errors.description && <div className="text-danger">{errors.description}</div>}

                <input
                  type="date"
                  className="form-control"
                  value={showEdit ? editTask.dueDate : newTask.dueDate}
                  onChange={(e) => showEdit ? setEditTask({ ...editTask, dueDate: e.target.value }) : setNewTask({ ...newTask, dueDate: e.target.value })}
                />
                {errors.dueDate && <div className="text-danger">{errors.dueDate}</div>}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { setShowAdd(false); setShowEdit(false); }}>Cancel</button>
                <button className="btn btn-success" onClick={showEdit ? handleUpdateTask : handleAddTask}>
                  {showEdit ? "Update Task" : "Add Task"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
      {showDelete && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button className="btn-close" onClick={() => setShowDelete(false)}></button>
              </div>
              <div className="modal-body">Are you sure you want to delete this task?</div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Tasks;
