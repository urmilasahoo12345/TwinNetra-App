import { create } from "zustand";
import type { FilterState } from "../types";

export const useFilterStore = create<FilterState>((set) => ({
  selectedMonth: null,
  selectedDistrict: "Bhubaneswar",
  futureRise: 2,
  setMonth: (m) => set({ selectedMonth: m }),
  setDistrict: (d) => set({ selectedDistrict: d }),
  setFutureRise: (r) => set({ futureRise: r }),
}));
