const express = require("express");
const router = express.Router();
const {
  getAllContactForms,
  getContactFormById,
  createContactForm,
  updateContactForm,
  deleteContactForm,
} = require("../controllers/contactFormController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

router.get("/", adminMiddleware, getAllContactForms);
router.get("/:id", authMiddleware, getContactFormById);
router.post("/", createContactForm);
router.put("/:id", adminMiddleware, updateContactForm);
router.delete("/:id", adminMiddleware, deleteContactForm);

module.exports = router;
