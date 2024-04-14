import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Context from "./context/Context.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import "react-tagsinput/react-tagsinput.css";
import "./components/Theme/Theme.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Context>
        <App />
      </Context>
    </BrowserRouter>
  </React.StrictMode>
);
