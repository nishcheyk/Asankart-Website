import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App"; 
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import cartReducer from "./store/cart/cartReducer";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    cartStore: cartReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
