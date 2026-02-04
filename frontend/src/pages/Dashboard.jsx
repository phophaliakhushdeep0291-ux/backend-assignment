import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/api"; // Using our cookie-enabled API instance

function Dashboard() {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Fetch User Tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await API.get("/tasks");
        // Your controller returns tasks in response.data.data
        setTasks(response.data.data);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [navigate]);

  // 2. Create Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/tasks", newTask);
      if (response.data.success) {
        setTasks([response.data.data, ...tasks]); // Add to top of list
        setNewTask({ title: "", description: "" });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error creating task");
    }
  };

  // 3. Toggle Task Status (Uses your updateTask controller)
  const toggleStatus = async (task) => {
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      const response = await API.patch(`/tasks/${task._id}`, { status: newStatus });
      
      setTasks(tasks.map(t => t._id === task._id ? response.data.data : t));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // 4. Delete Task
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

const handleLogout = async () => {
  try {
    await API.post("/users/logout"); // This hits your backend logoutUser controller
    logout(); // This clears the React state and localStorage
    navigate("/login");
  } catch (err) {
    console.error("Logout failed", err);
    logout(); // Force logout on frontend even if backend call fails
    navigate("/login");
  }
};

  if (loading) return <div className="loading">Loading your workspace...</div>;

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h2>My Daily Tasks</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <form className="task-form" onSubmit={handleAddTask}>
        <input 
          placeholder="What needs to be done?" 
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          required 
        />
        <textarea 
          placeholder="Description (optional)" 
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="task-grid">
        {tasks.map((task) => (
          <div key={task._id} className={`task-card ${task.status}`}>
            <div className="task-info">
              <input 
                type="checkbox" 
                checked={task.status === "completed"} 
                onChange={() => toggleStatus(task)}
              />
              <div>
                <h4 style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                  {task.title}
                </h4>
                <p>{task.description}</p>
              </div>
            </div>
            <button className="delete-icon" onClick={() => handleDelete(task._id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;