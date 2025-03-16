import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import AuthGuard from "./components/AuthGuard";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location.pathname]); // Update when the route changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Hide Navbar on Login & Signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") return null;

  return (
    <nav className="navbar">
      <h2>Task Management</h2>
      {isLoggedIn && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<AuthGuard />}>
          <Route path="/tasks" element={<Tasks />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
