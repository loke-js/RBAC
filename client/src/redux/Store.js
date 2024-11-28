import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

// Combine multiple reducers (if needed)
const rootReducer = combineReducers({
  Auth: AuthSlice,
  // Add other slices here if necessary
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["Auth"], // Persist only the Auth slice
};

// Persist the combined reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

// Configure persistor
export const persistor = persistStore(store);
