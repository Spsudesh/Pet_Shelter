import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import "./Pets.css";
import { fetchPets, imageUrl } from "./API";
import logo from "../Images/logo.png";

function Pets({ user, onLogout }) {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("All");

  useEffect(() => {
    fetchPets()
      .then(setPets)
      .catch((err) => console.error("Failed to fetch pets:", err));
  }, []);

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
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Pet Shelter Logo" className="navbar-logo" />
          <div className="navbar-brand-text">
            <span className="navbar-title">Pet Shelter</span>
            <span className="navbar-tagline">Where Families Grow with Pets</span>
          </div>
        </Link>
        <ul className="navbar-links">
          {user && user.role === "admin" ? (
            <>
              <li><Link to="/admin">Admin Dashboard</Link></li>
              <li><Link to="/requests">Requests</Link></li>
              <li><Link to="/contact">Enquiries</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><button onClick={onLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/pets">Pets</Link></li>
              <li><Link to="/adopt">Adopt</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              {user ? (
                <li><button onClick={onLogout}>Logout</button></li>
              ) : (
                <li><Link to="/login">Login</Link></li>
              )}
            </>
          )}
        </ul>
      </nav>

      {/* Pets Section */}
      <div className="pets-page-header">
        <h2>Meet The Pets</h2>
        <p>
          Every pet here deserves a loving home. Browse our available animals and find your perfect companion.
          Adopting a pet is one of the most rewarding experiences — give a pet a second chance at life!
        </p>

        <div className="hero-search-bar" style={{ maxWidth: "500px", margin: "20px auto" }}>
          <input
            type="text"
            placeholder="Search by name, species, or breed..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-search">Search</button>
        </div>
        <div className="filter-buttons" style={{ justifyContent: "center" }}>
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

      <div className="pets-section">
        {filteredPets.length === 0 ? (
          <p className="no-pets">No pets available for adoption.</p>
        ) : (
          <div className="pets-grid">
            {filteredPets.map((pet) => (
              <Link to={`/petdetails/${pet._id}`} key={pet._id} className="pet-card">
                <img src={imageUrl(pet.picture)} alt={pet.name} />
                <div className="pet-card-body">
                  <h3>{pet.name}</h3>
                  <p>Age: {pet.age} yr · {pet.gender}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Pets;
