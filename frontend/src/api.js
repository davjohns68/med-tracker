const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch(`${API_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const register = async (username, password) => {
  const res = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};

export const getMedications = async () => {
  const res = await fetch(`${API_URL}/medications/`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch medications");
  return res.json();
};

export const addMedication = async (med) => {
  const res = await fetch(`${API_URL}/medications/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(med),
  });
  if (!res.ok) throw new Error("Failed to add medication");
  return res.json();
};

export const takeMedication = async (medId) => {
  const res = await fetch(`${API_URL}/medications/${medId}/take`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to update medication");
  return res.json();
};

export const updateProfile = async (discord_webhook) => {
  const res = await fetch(`${API_URL}/users/me/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ discord_webhook }),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

