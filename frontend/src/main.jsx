import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import cartReducer from "./store/cart/cartReducer";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// Redux store configure karta hai - cart data manage karne ke liye
const store = configureStore({
  reducer: {
    cartStore: cartReducer, // Cart ka reducer add karta hai
  },
});

// Root element create karta hai - React app ko mount karne ke liye
const root = ReactDOM.createRoot(document.getElementById("root"));

// App ko render karta hai - Redux Provider aur BrowserRouter ke saath
root.render(
  <Provider store={store}> {/* Redux store provide karta hai pure app ko */}
    <BrowserRouter> {/* Browser routing enable karta hai */}
      <App /> {/* Main App component */}
    </BrowserRouter>
  </Provider>
);

// Performance metrics track karta hai - web vitals ke liye
reportWebVitals();
