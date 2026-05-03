import axios from "axios";

const trimTrailingSlash = (value) => value?.replace(/\/+$/, "") || "";

const envApiOrigin = trimTrailingSlash(process.env.REACT_APP_API_ORIGIN);
const envApiBaseUrl = trimTrailingSlash(process.env.REACT_APP_API_BASE_URL);

export const API_ORIGIN = envApiOrigin || "http://localhost:5000";
export const API_BASE_URL = envApiBaseUrl || `${API_ORIGIN}/api`;

export const imageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path}`;
};

// Fetch all pets
export const fetchPets = async () => {
  const response = await axios.get(`${API_BASE_URL}/pets`);
  return response.data;
};

// Fetch pet by ID
export const fetchPetById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/pets/${id}`);
  return response.data;
};

// Fetch user by ID
export const fetchUser = async (id, token) => {
  const response = await axios.get(`${API_BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Submit adoption form
export const submitAdoptionForm = async (formData, token) => {
  const response = await axios.post(`${API_BASE_URL}/adoption-forms`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch current user's adoption requests
export const fetchUserRequestsByToken = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/adoption-forms/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch all adoption requests (admin)
export const fetchAdoptionRequests = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/adoption-forms`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Submit contact form
export const submitContactForm = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/contact-forms`, formData);
  return response.data;
};

// Fetch all contact forms (admin)
export const fetchContactForms = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/contact-forms`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Create pet  - (admin)
export const createPet = async (formData, token) => {
  const response = await axios.post(`${API_BASE_URL}/pets`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update pet - (admin)
export const updatePet = async (id, formData, token) => {
  const response = await axios.put(`${API_BASE_URL}/pets/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Delete pet (admin)
export const deletePet = async (id, token) => {
  const response = await axios.delete(`${API_BASE_URL}/pets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update adoption request status (admin)
export const updateRequestStatus = async (id, status, token) => {
  const response = await axios.put(
    `${API_BASE_URL}/adoption-forms/${id}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Update contact form (admin - for read/contacted toggles)
export const updateContactFormById = async (id, data, token) => {
  const response = await axios.put(`${API_BASE_URL}/contact-forms/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
