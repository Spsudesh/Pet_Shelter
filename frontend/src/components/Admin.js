import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import "./Admin.css";
import { fetchPets, deletePet, fetchContactForms, updateContactFormById, imageUrl } from "./API";
import logo from "../Images/logo.png";

function Admin({ user, onLogout }) {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [enquiries, setEnquiries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadPets();
    loadEnquiries();
  }, []);

  const loadPets = () => {
    fetchPets().then(setPets).catch(console.error);
  };

  const loadEnquiries = () => {
    fetchContactForms(user.token).then(setEnquiries).catch(console.error);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    try {
      await deletePet(id, user.token);
      loadPets();
    } catch (err) {
      alert("Failed to delete pet.");
    }
  };

  const toggleFlag = async (enq, flag) => {
    const tag = `[${flag}]`;
    let subject = enq.subject;
    if (subject.includes(tag)) {
      subject = subject.replace(tag, "").trim();
    } else {
      subject = `${subject} ${tag}`.trim();
    }
    try {
      await updateContactFormById(enq._id, { subject }, user.token);
      loadEnquiries();
    } catch (err) {
      alert("Failed to update enquiry.");
    }
  };

  const filteredPets = pets.filter((pet) => {
    const query = search.toLowerCase();
    const matchesSearch =
      pet.name.toLowerCase().includes(query) ||
      pet.species.toLowerCase().includes(query) ||
      pet.breed.toLowerCase().includes(query);
    const matchesSpecies =
      speciesFilter === "All" ||
      (speciesFilter === "Others"
        ? pet.species.toLowerCase() !== "dog" && pet.species.toLowerCase() !== "cat"
        : pet.species.toLowerCase() === speciesFilter.toLowerCase());
    return matchesSearch && matchesSpecies;
  });

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

      <div className="admin-page">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
          <button className="btn-add-pet" onClick={() => navigate("/admin/add-pet")}>
            + Add New Pet
          </button>
        </div>

        {/* Search & Filters */}
        <div className="admin-controls">
          <input
            type="text"
            placeholder="Search pets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search"
          />
          <div className="filter-buttons">
            {["All", "Dog", "Cat", "Others"].map((f) => (
              <button
                key={f}
                className={`filter-btn ${speciesFilter === f ? "active" : ""}`}
                onClick={() => setSpeciesFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Pet Cards */}
        <div className="pets-grid">
          {filteredPets.map((pet) => (
            <div key={pet._id} className="pet-card admin-pet-card">
              <img src={imageUrl(pet.picture)} alt={pet.name} />
              <div className="pet-card-body">
                <h3>{pet.name}</h3>
                <p>Age: {pet.age} yr · {pet.gender}</p>
                <div className="admin-card-actions">
                  <button className="btn-edit" onClick={() => navigate(`/admin/edit-pet/${pet._id}`)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(pet._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Messages */}
        <div className="enquiries-section">
          <h3>Contact Messages / Enquiries</h3>
          {enquiries.length === 0 ? (
            <p className="no-enquiries">No enquiries yet.</p>
          ) : (
            <div className="enquiries-table-wrapper">
              <table className="enquiries-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enq) => (
                    <tr key={enq._id}>
                      <td>{enq.firstName} {enq.lastName}</td>
                      <td>{enq.email}</td>
                      <td>{enq.subject.replace(/\[(READ|CONTACTED)\]/g, "").trim()}</td>
                      <td>{enq.message.substring(0, 60)}{enq.message.length > 60 ? "..." : ""}</td>
                      <td>
                        {enq.subject.includes("[READ]") && <span className="badge badge-read">READ</span>}
                        {enq.subject.includes("[CONTACTED]") && <span className="badge badge-contacted">CONTACTED</span>}
                        {!enq.subject.includes("[READ]") && !enq.subject.includes("[CONTACTED]") && (
                          <span className="badge badge-new">NEW</span>
                        )}
                      </td>
                      <td>
                        <button className="btn-flag" onClick={() => toggleFlag(enq, "READ")}>
                          {enq.subject.includes("[READ]") ? "Unread" : "Read"}
                        </button>
                        <button className="btn-flag" onClick={() => toggleFlag(enq, "CONTACTED")}>
                          {enq.subject.includes("[CONTACTED]") ? "Uncontact" : "Contacted"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Admin;
