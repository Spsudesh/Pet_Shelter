import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import "./AboutUs.css";
import logo from "../Images/logo.png";
import aboutHero from "../Images/15.jpg";
import aboutGalleryOne from "../Images/11.jpg";
import aboutGalleryTwo from "../Images/12.jpg";

function AboutUs({ user, onLogout }) {
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
              {user ? <li><button onClick={onLogout}>Logout</button></li> : <li><Link to="/login">Login</Link></li>}
            </>
          )}
        </ul>
      </nav>

      <div className="about-page">
        <div className="about-container">
          <div className="about-content">
            <h2>About Us</h2>
            <p>
              Welcome to <strong>Pet Shelter</strong> - a place where love, compassion, and hope bring
              families and animals together. We are a dedicated rescue organization committed to giving
              abandoned, stray, and surrendered animals a second chance at life.
            </p>
            <p>
              Our mission is simple: every animal deserves a safe, loving home. We work every day to rescue,
              rehabilitate, and rehome pets of all kinds. Each pet profile in this project is backed by the
              real shelter data already saved in your existing MongoDB collections.
            </p>
            <p>
              We believe adoption should feel warm, trustworthy, and easy to navigate. That is why this
              project now brings your real pet records, enquiry data, adoption requests, and shelter imagery
              into one consistent experience.
            </p>
            <p>
              Whether you are looking to adopt your first pet, support the shelter, or simply learn more
              about animal welfare, we are here to help create happy new beginnings.
            </p>
          </div>
          <div className="about-image">
            <img src={aboutHero} alt="Shelter pets together" />
          </div>
        </div>
        <div className="about-gallery">
          <img src={aboutGalleryOne} alt="Shelter pet portrait" />
          <img src={aboutGalleryTwo} alt="Adoptable pet close-up" />
          <img src={logo} alt="Pet Shelter logo" />
        </div>
      </div>
    </>
  );
}

export default AboutUs;
