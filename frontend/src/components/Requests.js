import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import "./Requests.css";
import { fetchAdoptionRequests, updateRequestStatus } from "./API";
import logo from "../Images/logo.png";

function Requests({ user, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    fetchAdoptionRequests(user.token).then(setRequests).catch(console.error);
  };

  const handleStatus = async (id, status) => {
    try {
      await updateRequestStatus(id, status, user.token);
      loadRequests();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const filtered = requests.filter((r) => {
    const query = search.toLowerCase();
    const petName = r.pet?.name?.toLowerCase() || "";
    const adopterName = r.name?.toLowerCase() || "";
    return petName.includes(query) || adopterName.includes(query);
  });

  const statusClass = (s) => {
    if (s === "Accepted") return "status-badge accepted";
    if (s === "Rejected") return "status-badge rejected";
    return "status-badge pending";
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Pet Shelter Logo" className="navbar-logo" />
          <div className="navbar-brand-text">
            <span className="navbar-title">Pet Shelter</span>
            <span className="navbar-tagline">Where Families Grow with Pets</span>
          </div>
        </Link>
        <ul className="navbar-links">
          <li><Link to="/admin">Admin Dashboard</Link></li>
          <li><Link to="/requests">Requests</Link></li>
          <li><Link to="/contact">Enquiries</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><button onClick={onLogout}>Logout</button></li>
        </ul>
      </nav>

      <div className="requests-page">
        <h2>Submitted Adoption Request Forms</h2>
        <input
          type="text"
          placeholder="Search by pet name or adopter name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="req-search"
        />

        <div className="requests-table-wrapper">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Pet Name</th>
                <th>Adopter Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#888" }}>No requests found.</td></tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req._id}>
                    <td>{req.pet?.name || "—"}</td>
                    <td>{req.name}</td>
                    <td>{req.email}</td>
                    <td>{req.phoneNumber}</td>
                    <td><span className={statusClass(req.status)}>{req.status}</span></td>
                    <td>
                      <button
                        className="btn-accept"
                        onClick={() => handleStatus(req._id, "Accepted")}
                        disabled={req.status === "Accepted"}
                      >Accept</button>
                      <button
                        className="btn-reject"
                        onClick={() => handleStatus(req._id, "Rejected")}
                        disabled={req.status === "Rejected"}
                      >Reject</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Requests;
