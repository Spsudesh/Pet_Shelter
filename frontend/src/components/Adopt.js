import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import "./Adopt.css";
import {
  fetchPets, fetchUser, submitAdoptionForm, fetchUserRequestsByToken,
} from "./API";
import logo from "../Images/logo.png";

function Adopt({ user, onLogout }) {
  const [pets, setPets] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [formData, setFormData] = useState({
    pet: "",
    name: "",
    phoneNumber: "",
    email: "",
    addressLine: "",
    city: "",
    zipCode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadMyRequests = useCallback(() => {
    fetchUserRequestsByToken(user.token)
      .then(setMyRequests)
      .catch(console.error);
  }, [user.token]);

  useEffect(() => {
    fetchPets().then(setPets).catch(console.error);
    if (user && user.token) {
      fetchUser(user._id, user.token)
        .then((u) => {
          setFormData((prev) => ({
            ...prev,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            phoneNumber: u.phoneNumber,
          }));
        })
        .catch(console.error);
      loadMyRequests();
    }
  }, [user, loadMyRequests]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { pet, name, phoneNumber, email, addressLine, city, zipCode } = formData;
    if (!pet || !name || !phoneNumber || !email || !addressLine || !city || !zipCode) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      await submitAdoptionForm(formData, user.token);
      setSuccess("🎉 Adoption application submitted successfully!");
      setFormData((prev) => ({
        ...prev,
        pet: "",
        addressLine: "",
        city: "",
        zipCode: "",
      }));
      loadMyRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
    }
  };

  const statusMessage = (status) => {
    if (status === "Accepted") return "🎉 Congratulations! Your adoption request has been accepted!";
    if (status === "Rejected") return "😔 Unfortunately, your adoption request was not approved this time.";
    return "⏳ Your application is under review. We'll get back to you soon!";
  };

  const statusClass = (status) => {
    if (status === "Accepted") return "status-accepted";
    if (status === "Rejected") return "status-rejected";
    return "status-pending";
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
          <li><Link to="/">Home</Link></li>
          <li><Link to="/pets">Pets</Link></li>
          <li><Link to="/adopt">Adopt</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><button onClick={onLogout}>Logout</button></li>
        </ul>
      </nav>

      <div className="adopt-page">
        {/* My Requests */}
        {myRequests.length > 0 && (
          <div className="my-requests-section">
            <h3>My Adoption Requests</h3>
            <div className="requests-list">
              {myRequests.map((req) => (
                <div key={req._id} className={`request-card ${statusClass(req.status)}`}>
                  <div className="req-info">
                    <strong>{req.pet?.name || "Pet"}</strong>
                    <span className="req-status">{req.status}</span>
                  </div>
                  <p className="req-date">Submitted: {new Date(req.createdAt).toLocaleDateString()}</p>
                  <p className="req-msg">{statusMessage(req.status)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adoption Form */}
        <div className="adopt-form-container">
          <h2>Adoption Application Form</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="adopt-form">
            <div className="form-group">
              <label>Select Pet *</label>
              <select name="pet" value={formData.pet} onChange={handleChange} required>
                <option value="">-- Choose a pet --</option>
                {pets.map((p) => (
                  <option key={p._id} value={p._id}>{p.name} ({p.species})</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Address Line *</label>
              <input type="text" name="addressLine" value={formData.addressLine} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>ZIP / Postal Code *</label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="btn-submit">Submit Application</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Adopt;
