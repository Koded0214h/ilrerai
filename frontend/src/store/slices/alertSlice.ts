import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Alert {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  timestamp: string;
}

interface AlertState {
  alerts: Alert[];
}

const initialState: AlertState = {
  alerts: [],
};

const alertSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    addAlert: (
      state,
      action: PayloadAction<Omit<Alert, "id" | "timestamp">>
    ) => {
      const newAlert: Alert = {
        ...action.payload,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      };
      // Limit to 5 most recent alerts
      state.alerts = [newAlert, ...state.alerts.slice(0, 4)];
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
  },
});

export const { addAlert, removeAlert } = alertSlice.actions;
export default alertSlice.reducer;
