// import React so JSX works correctly in this entry file.
import React from "react";
// import ReactDOM so I can mount the app into the browser DOM.
import ReactDOM from "react-dom/client";
// import my top-level App component that wires providers and routes.
import { App } from "@/App.jsx";
// import global styles once at the app entry.
import "@/styles/global.css";

// find the root div in index.html and render my app there.
ReactDOM.createRoot(document.getElementById("root")).render(
  // keep StrictMode enabled in development to catch unsafe patterns early.
  <React.StrictMode>
    {/* I render the full application tree here. */}
    <App />
  </React.StrictMode>
);
