import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import "../css/Order.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null); // Check if the user is admin
  useEffect(() => {
    const isAdminFlag = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(isAdminFlag);
  }, []);

  useEffect(() => {
    if (isAdmin !== null) {
      console.log("isAdmin state:", isAdmin);
      getOrders(isAdmin);
    }
  }, [isAdmin]);

  const getOrders = async (adminStatus) => {
    try {
      const url = adminStatus
        ? "http://localhost:5000/order/all"
        : `http://localhost:5000/order/${localStorage.getItem("userId")}`;

      const response = await axios.get(url);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error fetching orders. Please try again later.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/order/${orderId}/status`,
        {
          orderStatus: newStatus,
        }
      );
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      );
      setOrders(updatedOrders);
      setSnackbarOpen(true);
      setError("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status.");
      setSnackbarOpen(true);
    }
  };

  const sortByDateASC = () => {
    const sorted = [...orders].sort(
      (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
    );
    setOrders(sorted);
  };

  const sortByDateDESC = () => {
    const sorted = [...orders].sort(
      (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
    );
    setOrders(sorted);
  };

  return (
    <>
      <NavBar />

      <div className="orders-page">
        <div className="header">
          <h1 className="head">Order History</h1>
          <div className="sort-buttons">
            <button onClick={sortByDateASC} className="sort-button">
              ↑ Date
            </button>
            <button onClick={sortByDateDESC} className="sort-button">
              ↓ Date
            </button>
          </div>
        </div>

        {error && snackbarOpen && (
          <div className="error-snackbar">
            <span>{error}</span>
            <button onClick={handleSnackbarClose}>Close</button>
          </div>
        )}

        <div className="orders-container">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h4>Order #{order._id.slice(-6)}</h4>
                  <p>{new Date(order.createdDate).toLocaleString()}</p>
                </div>

                <span className="chip">{order.orderStatus}</span>
                {isAdmin && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <label
                      htmlFor={`status-${order._id}`}
                      className="status-label"
                    >
                      Status:
                    </label>
                    <select
                      id={`status-${order._id}`}
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="order-details">
                <div className="order-items">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(order.items)
                        ? order.items
                        : JSON.parse(order.items)
                      ).map((item) => (
                        <tr key={item._id}>
                          <td>{item.title}</td>
                          <td>₹{item.price}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="order-shipping">
                  <h5>Order By</h5>
                  <p>
                    {order.firstName} {order.lastName}
                  </p>
                  <h5>Shipping</h5>
                  <p>{order.address}</p>
                  <p>
                    {order.zipCode}, {order.country}
                  </p>
                  <p>+91 {order.mobileNumber}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
