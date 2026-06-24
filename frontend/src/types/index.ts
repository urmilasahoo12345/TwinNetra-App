export interface User {
  sub: string;
  role: string;
  user_name?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export interface FilterState {
  selectedMonth: number | null;
  selectedDistrict: string;
  futureRise: number;
  setMonth: (m: number | null) => void;
  setDistrict: (d: string) => void;
  setFutureRise: (r: number) => void;
}

export interface ClimateOverview {
  avg_rainfall: number;
  avg_temp: number;
  max_rainfall: number;
  max_temp: number;
  heatwave_count: number;
  wettest_month: number;
  hottest_month: number;
  rainfall_temp_correlation: number;
}

export interface TrendPoint {
  TIME: string;
  RAINFALL: number;
  MAX_TEMP: number;
}

export interface LiveResult {
  district: string;
  live_temp: number | null;
  historical_temp: number | null;
  difference: number | null;
  humidity: number | null;
  rainfall: number | null;
  status: string;
}

export interface SatelliteData {
  loaded: boolean;
  avg_lst: number;
  max_lst: number;
  min_lst: number;
  points: { lat: number; lon: number; lst: number }[];
}

export interface PredictionResult {
  predicted_temp: number;
  predicted_rain: number;
  temp_risk: string;
  rain_risk: string;
  temp_model_r2: number;
  rain_model_r2: number;
}
