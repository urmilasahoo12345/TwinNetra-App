import axios from "axios";
import { useAuthStore } from "../store/authStore";

const BASE = "/api";
const authHeader = () => ({
  Authorization: `Bearer ${useAuthStore.getState().token}`,
});

export const fetchLiveComparison = () =>
  axios.get(`${BASE}/live/comparison`, { headers: authHeader() }).then((r) => r.data);
