import axios from "axios";

const BASE = "https://twinnetra-app.onrender.com";

export async function loginApi(email: string, password: string) {
  const res = await axios.post(`${BASE}/auth/login`, { email, password });
  return res.data;
}

export async function signupApi(name: string, email: string, password: string) {
  const res = await axios.post(`${BASE}/auth/signup`, { name, email, password });
  return res.data;
}