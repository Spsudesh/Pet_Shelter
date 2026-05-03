const express = require("express");
const router = express.Router();
const {
  getAllAdoptionForms,
  getMyAdoptionForms,
  getAdoptionFormById,
  createAdoptionForm,
  updateAdoptionForm,
  deleteAdoptionForm,
} = require("../controllers/adoptionFormController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// IMPORTANT: /me must be defined before /:id to avoid route shadowing
router.get("/", adminMiddleware, getAllAdoptionForms);
router.get("/me", authMiddleware, getMyAdoptionForms);
router.get("/:id", authMiddleware, getAdoptionFormById);
router.post("/", authMiddleware, createAdoptionForm);
router.put("/:id", adminMiddleware, updateAdoptionForm);
router.delete("/:id", adminMiddleware, deleteAdoptionForm);

module.exports = router;
