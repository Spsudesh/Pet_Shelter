const Pet = require("../models/petModel");

// GET /api/pets - public
const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find({});
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pets", error: error.message });
  }
};

// GET /api/pets/:id - public
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pet", error: error.message });
  }
};

// POST /api/pets - admin only
const createPet = async (req, res) => {
  try {
    const {
      name, species, breed, gender, size, color,
      about, medicalConditions, adoptionFee,
    } = req.body;

    const age = Number(req.body.age);
    const adoptionFeeNum = Number(adoptionFee);
    const vaccinated = req.body.vaccinated === "true" || req.body.vaccinated === true;
    const neutered = req.body.neutered === "true" || req.body.neutered === true;

    if (!req.file) {
      return res.status(400).json({ message: "Pet picture is required." });
    }
    const picture = `/uploads/${req.file.filename}`;

    const pet = new Pet({
      name, species, age, breed, gender, size, color,
      about, vaccinated, neutered, medicalConditions,
      adoptionFee: adoptionFeeNum, picture,
    });
    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: "Error creating pet", error: error.message });
  }
};

// PUT /api/pets/:id - admin only
const updatePet = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.age !== undefined) updateData.age = Number(updateData.age);
    if (updateData.adoptionFee !== undefined) updateData.adoptionFee = Number(updateData.adoptionFee);
    if (updateData.vaccinated !== undefined)
      updateData.vaccinated = updateData.vaccinated === "true" || updateData.vaccinated === true;
    if (updateData.neutered !== undefined)
      updateData.neutered = updateData.neutered === "true" || updateData.neutered === true;

    if (req.file) {
      updateData.picture = `/uploads/${req.file.filename}`;
    }

    const pet = await Pet.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: "Error updating pet", error: error.message });
  }
};

// DELETE /api/pets/:id - admin only
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting pet", error: error.message });
  }
};

module.exports = { getAllPets, getPetById, createPet, updatePet, deletePet };
