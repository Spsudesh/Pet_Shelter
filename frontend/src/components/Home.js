import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { fetchPets, imageUrl } from "./API";
import logo from "../Images/logo.png";
import heroImage from "../Images/12.jpg";
import highlightOne from "../Images/12.jpg";
import highlightTwo from "../Images/13.jpg";

function Home({ user, onLogout }) {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("All");

  useEffect(() => {
    document.title = "Pet Shelter";
    const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
    link.rel = "icon";
    link.href = logo;
    document.head.appendChild(link);

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

      <div className="hero-section">
        <div className="hero-content">
          <h1>Adopt A Cute Pet</h1>
          <p>
            Meet rescue pets already saved in your shelter database and find the one
            that fits your home, routine, and heart.
          </p>
          <div className="hero-search-bar">
            <input
              type="text"
              placeholder="Search by name, species, or breed..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn-search">Search</button>
          </div>
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
          <div className="hero-highlights">
            <div className="hero-highlight">
              <strong>{pets.length}+</strong>
              <span>Pets ready to meet families</span>
            </div>
            <div className="hero-highlight">
              <strong>Real shelter data</strong>
              <span>Loaded from your existing MongoDB records</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Happy shelter pet" />
        </div>
      </div>

      <div className="story-strip">
        <div className="story-card">
          <img src={highlightOne} alt="Playful pet at the shelter" />
          <div>
            <h3>Rescue, care, and trust</h3>
            <p>Each profile comes from the shelter records already stored in your existing database.</p>
          </div>
        </div>
        <div className="story-card">
          <img src={highlightTwo} alt="Shelter pets waiting for adoption" />
          <div>
            <h3>Adoption made simple</h3>
            <p>Browse pets, review details, and send adoption requests without leaving the app.</p>
          </div>
        </div>
      </div>

      <div className="pets-section">
        <h2>Available Pets</h2>
        {filteredPets.length === 0 ? (
          <p className="no-pets">No pets available for adoption.</p>
        ) : (
          <div className="pets-grid">
            {filteredPets.map((pet) => (
              <Link to={`/petdetails/${pet._id}`} key={pet._id} className="pet-card">
                <img src={imageUrl(pet.picture)} alt={pet.name} />
                <div className="pet-card-body">
                  <h3>{pet.name}</h3>
                  <p>{pet.species} - {pet.breed}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
