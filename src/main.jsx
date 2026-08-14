import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { useAuthStore } from "./store/authStore";
import "./styles/index.css";

// Initialize auth state BEFORE rendering
useAuthStore.getState().initialize();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "Segoe UI, Tahoma, Arial, sans-serif",
            direction: "rtl",
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
);
