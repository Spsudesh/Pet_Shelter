import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import "./ContactUs.css";
import { submitContactForm, fetchContactForms, updateContactFormById } from "./API";
import logo from "../Images/logo.png";
import contactImage from "../Images/13.jpg";

function ContactIcon({ type }) {
  const icons = {
    phone: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.08.36 2.24.56 3.43.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4.8a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.35.56 3.44a1 1 0 0 1-.25 1.02z" />
      </svg>
    ),
    email: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2 8 5 8-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    address: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s-6-5.4-6-10a6 6 0 1 1 12 0c0 4.6-6 10-6 10zm0-7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
      </svg>
    ),
    social: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5.2A3.8 3.8 0 1 0 15.8 12 3.8 3.8 0 0 0 12 8.2zm5-1.7a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
      </svg>
    ),
    hours: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 22a10 10 0 1 1 10-10 10 10 0 0 1-10 10zm1-15h-2v6l5 3 1-1.7-4-2.3z" />
      </svg>
    ),
  };

  return icons[type] || icons.phone;
}

function ContactUs({ user, onLogout }) {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", subject: "", message: "",
  });
  const [enquiries, setEnquiries] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const contactItems = [
    { type: "phone", title: "Phone", value: "+1 (800) 123-4567" },
    { type: "email", title: "Email", value: "admin@123.com" },
    { type: "address", title: "Address", value: "123 Paws Lane, Animal City, CA 90001" },
    { type: "social", title: "Social Media", value: "@PetShelter" },
    { type: "hours", title: "Business Hours", value: "Mon-Sat: 9AM - 6PM" },
  ];

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchContactForms(user.token).then(setEnquiries).catch(console.error);
    }
  }, [user]);

  const loadEnquiries = () => {
    fetchContactForms(user.token).then(setEnquiries).catch(console.error);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { firstName, lastName, email, subject, message } = formData;
    if (!firstName || !lastName || !email || !subject || !message) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      await submitContactForm(formData);
      setSuccess("Message sent successfully. We'll get back to you soon.");
      setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again.");
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
      alert("Failed to update.");
    }
  };

  if (user && user.role === "admin") {
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
        <div className="contact-page">
          <h2>Enquiries</h2>
          {enquiries.length === 0 ? (
            <p className="no-enq">No enquiries yet.</p>
          ) : (
            <div className="enq-table-wrapper">
              <table className="enq-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Status</th><th>Actions</th>
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
                        {enq.subject.includes("[READ]") && <span className="badge b-read">READ</span>}
                        {enq.subject.includes("[CONTACTED]") && <span className="badge b-contacted">CONTACTED</span>}
                        {!enq.subject.includes("[READ]") && !enq.subject.includes("[CONTACTED]") && (
                          <span className="badge b-new">NEW</span>
                        )}
                      </td>
                      <td>
                        <button className="btn-flag-c" onClick={() => toggleFlag(enq, "READ")}>
                          {enq.subject.includes("[READ]") ? "Unread" : "Mark Read"}
                        </button>
                        <button className="btn-flag-c" onClick={() => toggleFlag(enq, "CONTACTED")}>
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
      </>
    );
  }

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
          {user ? <li><button onClick={onLogout}>Logout</button></li> : <li><Link to="/login">Login</Link></li>}
        </ul>
      </nav>

      <div className="contact-page">
        <h2>Contact</h2>
        <div className="contact-layout">
          <div className="contact-info">
            {contactItems.map((item) => (
              <div className="info-block" key={item.title}>
                <span className="info-icon">
                  <ContactIcon type={item.type} />
                </span>
                <div className="info-copy">
                  <strong>{item.title}</strong>
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-form-container">
            <div className="contact-form-hero">
              <img src={contactImage} alt="Shelter pet" />
              <div>
                <strong>We would love to hear from you</strong>
                <p>Ask about adoption, visits, volunteering, or any pet you see in the shelter listings.</p>
              </div>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn-submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactUs;
