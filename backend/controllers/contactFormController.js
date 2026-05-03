const ContactForm = require("../models/contactFormModel");

// GET /api/contact-forms - admin only
const getAllContactForms = async (req, res) => {
  try {
    const forms = await ContactForm.find({});
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact forms", error: error.message });
  }
};

// GET /api/contact-forms/:id - authenticated
const getContactFormById = async (req, res) => {
  try {
    const form = await ContactForm.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Contact form not found" });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact form", error: error.message });
  }
};

// POST /api/contact-forms - public
const createContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;
    const form = new ContactForm({ firstName, lastName, email, subject, message });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: "Error submitting contact form", error: error.message });
  }
};

// PUT /api/contact-forms/:id - admin only
const updateContactForm = async (req, res) => {
  try {
    const form = await ContactForm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!form) return res.status(404).json({ message: "Contact form not found" });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: "Error updating contact form", error: error.message });
  }
};

// DELETE /api/contact-forms/:id - admin only
const deleteContactForm = async (req, res) => {
  try {
    const form = await ContactForm.findByIdAndDelete(req.params.id);
    if (!form) return res.status(404).json({ message: "Contact form not found" });
    res.status(200).json({ message: "Contact form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact form", error: error.message });
  }
};

module.exports = {
  getAllContactForms,
  getContactFormById,
  createContactForm,
  updateContactForm,
  deleteContactForm,
};
