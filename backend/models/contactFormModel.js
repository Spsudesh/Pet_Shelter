const mongoose = require("mongoose");

const contactFormSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { collection: "contactforms" }
);

const ContactForm = mongoose.model("ContactForm", contactFormSchema);
module.exports = ContactForm;
