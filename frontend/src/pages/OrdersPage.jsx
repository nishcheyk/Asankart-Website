import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import '../css/Order.css';


const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null); // Added error state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Added snackbarOpen state

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get("http://localhost:5000/order/" + userId);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error fetching orders. Please try again later."); // Set error message
      setSnackbarOpen(true); // Open Snackbar to display error message
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close Snackbar
  };

  const sortByDateASC = () => {
    let arrayForSort = [...orders];
    const ascArray = arrayForSort.sort((a, b) => {
      const date1 = new Date(a.createdDate);
      const date2 = new Date(b.createdDate);
      return date1 - date2;
    });
    setOrders(ascArray);
  };

  const sortByDateDESC = () => {
    let arrayForSort = [...orders];
    const ascArray = arrayForSort.sort((a, b) => {
      const date1 = new Date(a.createdDate);
      const date2 = new Date(b.createdDate);
      return date2 - date1;
    });
    setOrders(ascArray);
  };

  return (
    <div className="orders-page">
      <NavBar />
      <div className="header">
        <h1>Order history</h1>
        <div className="sort-buttons">
          <button onClick={sortByDateASC} className="sort-button">
            Date (Ascending)
          </button>
          <button onClick={sortByDateDESC} className="sort-button">
            Date (Descending)
          </button>
        </div>
      </div>

      {error && (
        <div className="error-snackbar">
          <span>{error}</span>
          <button onClick={handleSnackbarClose}>Close</button>
        </div>
      )}

      <div className="orders-container">
        {orders &&
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h4>Order number: {order._id}</h4>
                  <p>{order.createdDate}</p>
                </div>
                <span className="chip">Processing...</span>
              </div>

              <div className="order-details">
                <div className="order-items">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(order.items)
                        ? order.items.map((item) => (
                            <tr key={item._id}>
                              <td>{item.title}</td>
                              <td>₹{item.price}</td>
                              <td>{item.quantity}</td>
                              <td>{order.totalAmount}</td>
                            </tr>
                          ))
                        : JSON.parse(order.items).map((item) => (
                            <tr key={item._id}>
                              <td>{item.title}</td>
                              <td>₹{item.price}</td>
                              <td>{item.quantity}</td>
                              <td>{order.totalAmount}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>

                <div className="order-shipping">
                  <h5>Order details:</h5>
                  <p>{order.firstName} {order.lastName}</p>

                  <h5>Shipping:</h5>
                  <p>{order.address}</p>
                  <p>{order.zipCode}</p>
                  <p>{order.country}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrdersPage;
