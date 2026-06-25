import axios from "axios";
import { useAuthStore } from "../store/authStore";

const BASE = "https://twinnetra-app.onrender.com";
const authHeader = () => ({
  Authorization: `Bearer ${useAuthStore.getState().token}`,
});

export const fetchSatelliteLST = () =>
  axios.get(`${BASE}/satellite/lst`, { headers: authHeader() }).then((r) => r.data);

export const fetchScenario = (futureRise: number) =>
  axios
    .get(`${BASE}/satellite/scenario`, {
      params: { future_rise: futureRise },
      headers: authHeader(),
    })
    .then((r) => r.data);
