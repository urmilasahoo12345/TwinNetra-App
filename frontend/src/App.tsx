import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/UI/ProtectedRoute";
import AppLayout from "./components/Layout/AppLayout";
import SignIn from "./pages/SignIn";
import Overview from "./pages/Overview";
import Rainfall from "./pages/Rainfall";
import Temperature from "./pages/Temperature";
import ClimateRelation from "./pages/ClimateRelation";
import ClimateMap from "./pages/ClimateMap";
import Prediction from "./pages/Prediction";
import LiveMonitor from "./pages/LiveMonitor";
import SatelliteLST from "./pages/SatelliteLST";
import RawData from "./pages/RawData";
import Architecture from "./pages/Architecture";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Overview />} />
            <Route path="rainfall" element={<Rainfall />} />
            <Route path="temperature" element={<Temperature />} />
            <Route path="relation" element={<ClimateRelation />} />
            <Route path="map" element={<ClimateMap />} />
            <Route path="prediction" element={<Prediction />} />
            <Route path="live" element={<LiveMonitor />} />
            <Route path="satellite" element={<SatelliteLST />} />
            <Route path="rawdata" element={<RawData />} />
            <Route path="architecture" element={<Architecture />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1A2540", color: "#F0F4FF", border: "1px solid rgba(0,201,200,0.2)", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" },
        }}
      />
    </QueryClientProvider>
  );
}
