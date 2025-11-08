import { configureStore } from "@reduxjs/toolkit";
import facilitySlice from "./slices/facilitySlice";
import patientSlice from "./slices/patientSlice";
import alertSlice from "./slices/alertSlice";
import authSlice from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    facility: facilitySlice,
    patients: patientSlice,
    alerts: alertSlice,
    auth: authSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["some/action/type"],
        ignoredPaths: ["some.path"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
