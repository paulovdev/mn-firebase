import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Context from "./context/Context.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import "./index.scss";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Context>
          <SearchProvider>
            <App />
          </SearchProvider>
        </Context>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
