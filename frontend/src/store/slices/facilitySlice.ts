import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FacilityState {
  isOpen: boolean;
  hours: string;
  services: string[];
  drugStock: { [key: string]: number };
}

const initialState: FacilityState = {
  isOpen: true,
  hours: "8:00 AM - 5:00 PM",
  services: ["Immunization", "Antenatal", "General Consultation", "Dental Care", "Eye Care", "Mental Health"],
  drugStock: {
    Paracetamol: 150,
    ORS: 80,
    Amoxicillin: 45,
    Aspirin: 120,
    Metformin: 90,
    Insulin: 30,
    Warfarin: 25,
    Digoxin: 20,
  },
};

const facilitySlice = createSlice({
  name: "facility",
  initialState,
  reducers: {
    toggleFacilityStatus: (state) => {
      state.isOpen = !state.isOpen;
    },
    updateHours: (state, action: PayloadAction<string>) => {
      state.hours = action.payload;
    },
    updateServices: (state, action: PayloadAction<string[]>) => {
      state.services = action.payload;
    },
    updateDrugStock: (
      state,
      action: PayloadAction<{ [key: string]: number }>
    ) => {
      state.drugStock = { ...state.drugStock, ...action.payload };
    },
  },
});

export const {
  toggleFacilityStatus,
  updateHours,
  updateServices,
  updateDrugStock,
} = facilitySlice.actions;
export default facilitySlice.reducer;
