import axios from "axios";
import { useAuthStore } from "../store/authStore";

const BASE = "https://twinnetra-app.onrender.com";
const authHeader = () => ({
  Authorization: `Bearer ${useAuthStore.getState().token}`,
});

export const fetchDistricts = () =>
  axios.get(`${BASE}/prediction/districts`, { headers: authHeader() }).then((r) => r.data);

export const runPrediction = (payload: {
  district: string;
  rainfall: number;
  temperature: number;
  month: number;
  day: number;
}) =>
  axios
    .post(`${BASE}/prediction/predict`, payload, { headers: authHeader() })
    .then((r) => r.data);
