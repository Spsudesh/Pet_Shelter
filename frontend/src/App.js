import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Pets from "./components/Pets";
import PetDetails from "./components/PetDetails";
import Adopt from "./components/Adopt";
import Admin from "./components/Admin";
import Requests from "./components/Requests";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AddPet from "./components/AddPet";
import EditPet from "./components/EditPet";

// Protected Route component
const ProtectedRoute = ({ user, adminOnly, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    alert("You have been logged out successfully!");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
        <Route path="/about" element={<AboutUs user={user} onLogout={handleLogout} />} />
        <Route path="/contact" element={<ContactUs user={user} onLogout={handleLogout} />} />
        <Route path="/pets" element={<Pets user={user} onLogout={handleLogout} />} />
        <Route path="/petdetails/:petId" element={<PetDetails user={user} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} user={user} />} />
        <Route path="/signup" element={<SignUp user={user} />} />
        <Route
          path="/adopt"
          element={
            <ProtectedRoute user={user}>
              <Adopt user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} adminOnly>
              <Admin user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute user={user} adminOnly>
              <Requests user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-pet"
          element={
            <ProtectedRoute user={user} adminOnly>
              <AddPet user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-pet/:petId"
          element={
            <ProtectedRoute user={user} adminOnly>
              <EditPet user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<div style={{ textAlign: "center", padding: "100px", fontSize: "2rem" }}>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
