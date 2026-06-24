import axios from "axios";
import { useAuthStore } from "../store/authStore";

const BASE = "/api";

function authHeader() {
  const token = useAuthStore.getState().token;
  return { Authorization: `Bearer ${token}` };
}

export const fetchOverview = (month?: number | null) =>
  axios
    .get(`${BASE}/climate/overview`, {
      params: month ? { month } : {},
      headers: authHeader(),
    })
    .then((r) => r.data);

export const fetchTrend = (month?: number | null) =>
  axios
    .get(`${BASE}/climate/trend`, {
      params: month ? { month } : {},
      headers: authHeader(),
    })
    .then((r) => r.data);

export const fetchMonthlyAverages = () =>
  axios
    .get(`${BASE}/climate/monthly-averages`, { headers: authHeader() })
    .then((r) => r.data);

export const fetchSpatial = (variable: string, month?: number | null) =>
  axios
    .get(`${BASE}/climate/spatial`, {
      params: { variable, ...(month ? { month } : {}) },
      headers: authHeader(),
    })
    .then((r) => r.data);

export const fetchRaw = (month?: number | null, limit = 100) =>
  axios
    .get(`${BASE}/climate/raw`, {
      params: { limit, ...(month ? { month } : {}) },
      headers: authHeader(),
    })
    .then((r) => r.data);

export const fetchTopEvents = (variable: string, month?: number | null) =>
  axios
    .get(`${BASE}/climate/top-events`, {
      params: { variable, ...(month ? { month } : {}) },
      headers: authHeader(),
    })
    .then((r) => r.data);

export const fetchScatter = (month?: number | null) =>
  axios
    .get(`${BASE}/climate/scatter`, {
      params: month ? { month } : {},
      headers: authHeader(),
    })
    .then((r) => r.data);

export const fetchCorrelation = () =>
  axios
    .get(`${BASE}/climate/correlation`, { headers: authHeader() })
    .then((r) => r.data);
