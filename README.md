# TwinNetra

https://twin-netra-app.vercel.app

TwinNetra is a full-stack web application designed for real-time climate monitoring, historical weather comparison, and AI-driven climate prediction. Built with a focus on high performance and data accuracy, it provides actionable meteorological insights for key districts.

## 🚀 Key Benefits & Features

*   **Live Climate Monitoring:** Fetches real-time temperature, humidity, and rainfall data directly from the Open-Meteo API using an optimized client-side architecture to ensure high availability.
*   **Historical Baselines:** Automatically compares real-time metrics against historical averages to instantly classify current conditions (e.g., "Normal," "Above Normal," "Below Normal").
*   **AI Prediction Engine:** Utilizes a custom-trained Scikit-Learn Machine Learning model (Random Forest Regressor) to forecast next-day climate conditions based on multi-variable inputs.
*   **Interactive Data Visualization:** Displays complex meteorological data and spatial LST (Land Surface Temperature) maps through an intuitive, dark-themed UI.

## 💻 Technology Stack

**Frontend**
*   **Framework:** React with TypeScript and Vite
*   **State Management & Fetching:** React Query, Axios
*   **Visualization:** React Plotly.js
*   **Deployment:** Vercel

**Backend**
*   **Framework:** Python with FastAPI
*   **Data Processing:** Pandas, NumPy
*   **Machine Learning:** Scikit-Learn, Joblib
*   **Deployment:** Render

**External APIs**
*   Open-Meteo API (Client-side integration)