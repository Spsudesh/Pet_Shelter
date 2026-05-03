const express = require("express");
const router = express.Router();
const {
  getAllUsers, getUserById, createUser, loginUser, updateUser, deleteUser,
} = require("../controllers/userController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

router.get("/", adminMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.post("/", createUser);
router.post("/signup", createUser);
router.post("/login", loginUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", adminMiddleware, deleteUser);

module.exports = router;
