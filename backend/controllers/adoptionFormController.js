const AdoptionForm = require("../models/adoptionFormModel");

// GET /api/adoption-forms - admin only
const getAllAdoptionForms = async (req, res) => {
  try {
    const forms = await AdoptionForm.find({}).populate("pet").populate("user");
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching adoption forms", error: error.message });
  }
};

// GET /api/adoption-forms/me - authenticated current user
const getMyAdoptionForms = async (req, res) => {
  try {
    const forms = await AdoptionForm.find({ user: req.user._id })
      .populate("pet")
      .populate("user");
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your adoption forms", error: error.message });
  }
};

// GET /api/adoption-forms/:id - authenticated
const getAdoptionFormById = async (req, res) => {
  try {
    const form = await AdoptionForm.findById(req.params.id).populate("pet").populate("user");
    if (!form) return res.status(404).json({ message: "Adoption form not found" });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: "Error fetching adoption form", error: error.message });
  }
};

// POST /api/adoption-forms - authenticated
const createAdoptionForm = async (req, res) => {
  try {
    const { pet, name, phoneNumber, email, addressLine, city, zipCode } = req.body;
    const form = new AdoptionForm({
      user: req.user._id,
      pet,
      name,
      phoneNumber,
      email,
      addressLine,
      city,
      zipCode,
      status: "Pending",
    });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: "Error submitting adoption form", error: error.message });
  }
};

// PUT /api/adoption-forms/:id - admin only
const updateAdoptionForm = async (req, res) => {
  try {
    const form = await AdoptionForm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!form) return res.status(404).json({ message: "Adoption form not found" });
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: "Error updating adoption form", error: error.message });
  }
};

// DELETE /api/adoption-forms/:id - admin only
const deleteAdoptionForm = async (req, res) => {
  try {
    const form = await AdoptionForm.findByIdAndDelete(req.params.id);
    if (!form) return res.status(404).json({ message: "Adoption form not found" });
    res.status(200).json({ message: "Adoption form deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting adoption form", error: error.message });
  }
};

module.exports = {
  getAllAdoptionForms,
  getMyAdoptionForms,
  getAdoptionFormById,
  createAdoptionForm,
  updateAdoptionForm,
  deleteAdoptionForm,
};
