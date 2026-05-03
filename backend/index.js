require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const connectDb = require("./Configuration/connectDb");
const User = require("./models/userModel");

const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
const adoptionFormRoutes = require("./routes/adoptionFormRoutes");
const contactFormRoutes = require("./routes/contactFormRoutes");

connectDb();

const app = express();

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/adoption-forms", adoptionFormRoutes);
app.use("/api/contact-forms", contactFormRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Pet Shelter API is running" });
});

const DEFAULT_ADMIN = {
  firstName: "Admin",
  lastName: "User",
  phoneNumber: "0000000000",
  email: process.env.ADMIN_EMAIL || "admin@123.com",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

const LEGACY_ADMIN_EMAILS = ["admin@hopesanctuary.local", "admin@gmail.com"];

const seedAdmin = async () => {
  try {
    let admin = await User.findOne({ email: DEFAULT_ADMIN.email });

    if (!admin) {
      admin = await User.findOne({
        role: "admin",
        email: { $in: LEGACY_ADMIN_EMAILS.filter((email) => email !== DEFAULT_ADMIN.email) },
      });
    }

    if (!admin) {
      admin = new User({
        ...DEFAULT_ADMIN,
        role: "admin",
      });
      await admin.save();
      console.log(`Admin user seeded: ${DEFAULT_ADMIN.email}`);
      return;
    }

    admin.firstName = DEFAULT_ADMIN.firstName;
    admin.lastName = DEFAULT_ADMIN.lastName;
    admin.phoneNumber = DEFAULT_ADMIN.phoneNumber;
    admin.email = DEFAULT_ADMIN.email;
    admin.role = "admin";
    admin.tokens = [];

    const passwordMatches = await bcrypt.compare(DEFAULT_ADMIN.password, admin.password);
    if (!passwordMatches) {
      admin.password = DEFAULT_ADMIN.password;
    }

    await admin.save();
    console.log(`Admin user synced: ${DEFAULT_ADMIN.email}`);
  } catch (error) {
    console.error("Admin seeding failed:", error.message);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Pet Shelter Backend running on http://0.0.0.0:${PORT}`);
  await seedAdmin();
});
