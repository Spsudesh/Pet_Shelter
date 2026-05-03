import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import "./Adopt.css";
import { createPet } from "./API";
import logo from "../Images/logo.png";

function AddPet({ user, onLogout }) {
  const [formData, setFormData] = useState({
    name: "", species: "", breed: "", size: "", age: "", gender: "",
    color: "", about: "", vaccinated: "false", neutered: "false",
    medicalConditions: "None", adoptionFee: "",
  });
  const [picture, setPicture] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFile = (e) => setPicture(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!picture) { setError("Please upload a pet picture."); return; }
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    data.append("picture", picture);
    try {
      await createPet(data, user.token);
      setSuccess("🎉 Pet added successfully!");
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add pet.");
    }
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

      <div className="adopt-page">
        <div className="adopt-form-container">
          <h2>Add New Pet</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit} className="adopt-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Species *</label>
                <input name="species" value={formData.species} onChange={handleChange} required placeholder="e.g. Dog, Cat" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Breed *</label>
                <input name="breed" value={formData.breed} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Size *</label>
                <select name="size" value={formData.size} onChange={handleChange} required>
                  <option value="">-- Select --</option>
                  <option>Small</option><option>Medium</option><option>Large</option><option>Extra Large</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Age (years) *</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required min="0" />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">-- Select --</option>
                  <option>Male</option><option>Female</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Color *</label>
                <input name="color" value={formData.color} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Adoption Fee ($) *</label>
                <input type="number" name="adoptionFee" value={formData.adoptionFee} onChange={handleChange} required min="0" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Vaccinated *</label>
                <select name="vaccinated" value={formData.vaccinated} onChange={handleChange}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Neutered *</label>
                <select name="neutered" value={formData.neutered} onChange={handleChange}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>About *</label>
              <textarea name="about" value={formData.about} onChange={handleChange} rows="3" required />
            </div>
            <div className="form-group">
              <label>Medical Conditions *</label>
              <input name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Pet Picture *</label>
              <input type="file" accept="image/*" onChange={handleFile} required />
            </div>
            <div style={{ display: "flex", gap: "14px" }}>
              <button type="submit" className="btn-submit">Add Pet</button>
              <button type="button" className="btn-submit" style={{ background: "#e6f4fc", color: "#1675d3", border: "2px solid #1675d3" }} onClick={() => navigate("/admin")}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddPet;
