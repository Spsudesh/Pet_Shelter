import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./Home.css";
import "./PetDetails.css";
import { fetchPetById, imageUrl } from "./API";
import logo from "../Images/logo.png";

function PetDetails({ user, onLogout }) {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPetById(petId)
      .then(setPet)
      .catch((err) => console.error("Error fetching pet:", err))
      .finally(() => setLoading(false));
  }, [petId]);

  if (loading) return <div className="loading-msg">Loading pet details...</div>;
  if (!pet) return <div className="loading-msg">Pet not found.</div>;

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

      <div className="pet-details-page">
        <div className="pet-details-container">
          <div className="pet-details-image">
            <img src={imageUrl(pet.picture)} alt={pet.name} />
          </div>
          <div className="pet-details-card">
            <h2>{pet.name}</h2>
            <div className="detail-row"><span className="label">Breed:</span><span>{pet.breed}</span></div>
            <div className="detail-row"><span className="label">Gender:</span><span>{pet.gender}</span></div>
            <div className="detail-row"><span className="label">Age:</span><span>{pet.age} year(s)</span></div>
            <div className="detail-row"><span className="label">Species:</span><span>{pet.species}</span></div>
            <div className="detail-row"><span className="label">Size:</span><span>{pet.size}</span></div>
            <div className="detail-row"><span className="label">Color:</span><span>{pet.color}</span></div>
            <div className="detail-row"><span className="label">Vaccinated:</span><span>{pet.vaccinated ? "Yes ✅" : "No ❌"}</span></div>
            <div className="detail-row"><span className="label">Neutered:</span><span>{pet.neutered ? "Yes ✅" : "No ❌"}</span></div>
            <div className="detail-row"><span className="label">Adoption Fee:</span><span>${pet.adoptionFee}</span></div>
            <div className="detail-row"><span className="label">About:</span><span>{pet.about}</span></div>
            {pet.medicalConditions && pet.medicalConditions !== "None" && (
              <div className="detail-row"><span className="label">Medical Conditions:</span><span>{pet.medicalConditions}</span></div>
            )}
            <div className="pet-details-buttons">
              <button className="btn-adopt" onClick={() => navigate("/adopt")}>Apply to Adopt</button>
              <button className="btn-back" onClick={() => navigate("/pets")}>Back to Pets</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PetDetails;
