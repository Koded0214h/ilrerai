import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/api-client";
import socketService from "../../lib/socket";

interface Patient {
  id: string;
  name: string;
  phone: string;
  next_appointment?: string;
  risk_level: "low" | "medium" | "high";
  last_visit?: string;
  phc_name?: string;
}

interface PatientState {
  patients: Patient[];
  totalPatients: number;
  highRiskCount: number;
  adherenceRate: number;
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  totalPatients: 0,
  highRiskCount: 0,
  adherenceRate: 0,
  loading: false,
  error: null,
};

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async () => {
    const patients = await apiClient.getPatients();
    return patients;
  }
);

export const updatePatientRiskLevel = createAsyncThunk(
  'patients/updateRiskLevel',
  async ({ id, riskLevel }: { id: string; riskLevel: string }) => {
    await apiClient.updatePatient(id, { risk_level: riskLevel });
    return { id, riskLevel };
  }
);

const calculateStats = (patients: Patient[]) => {
  const totalPatients = patients.length;
  const highRiskCount = patients.filter(p => p.risk_level === "high").length;
  const adherenceRate = totalPatients > 0 ? Math.round((totalPatients - highRiskCount) / totalPatients * 100) : 0;
  
  return { totalPatients, highRiskCount, adherenceRate };
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    updatePatientRisk: (
      state,
      action: PayloadAction<{
        id: string;
        riskLevel: "low" | "medium" | "high";
      }>
    ) => {
      const patient = state.patients.find((p) => p.id === action.payload.id);
      if (patient) {
        patient.risk_level = action.payload.riskLevel;
        const stats = calculateStats(state.patients);
        state.highRiskCount = stats.highRiskCount;
        state.adherenceRate = stats.adherenceRate;
      }
    },
    updatePatientFromSync: (
      state,
      action: PayloadAction<Partial<Patient> & { id: string }>
    ) => {
      const patient = state.patients.find((p) => p.id === action.payload.id);
      if (patient) {
        Object.assign(patient, action.payload);
        const stats = calculateStats(state.patients);
        state.totalPatients = stats.totalPatients;
        state.highRiskCount = stats.highRiskCount;
        state.adherenceRate = stats.adherenceRate;
      }
    },
    setPatientActive: (
      state,
      action: PayloadAction<{ id: string; isActive: boolean }>
    ) => {
      const patient = state.patients.find((p) => p.id === action.payload.id);
      if (patient) {
        (patient as any).isActive = action.payload.isActive;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
        const stats = calculateStats(action.payload);
        state.totalPatients = stats.totalPatients;
        state.highRiskCount = stats.highRiskCount;
        state.adherenceRate = stats.adherenceRate;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch patients';
      })
      .addCase(updatePatientRiskLevel.fulfilled, (state, action) => {
        const patient = state.patients.find(p => p.id === action.payload.id);
        if (patient) {
          patient.risk_level = action.payload.riskLevel as "low" | "medium" | "high";
          const stats = calculateStats(state.patients);
          state.highRiskCount = stats.highRiskCount;
          state.adherenceRate = stats.adherenceRate;
        }
      });
  },
});

export const { updatePatientRisk, updatePatientFromSync, setPatientActive } = patientSlice.actions;
export default patientSlice.reducer;