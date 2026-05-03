const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getAllPets, getPetById, createPet, updatePet, deletePet,
} = require("../controllers/petController");
const { adminMiddleware } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/", getAllPets);
router.get("/:id", getPetById);
router.post("/", adminMiddleware, upload.single("picture"), createPet);
router.put("/:id", adminMiddleware, upload.single("picture"), updatePet);
router.delete("/:id", adminMiddleware, deletePet);

module.exports = router;
