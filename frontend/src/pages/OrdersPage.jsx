import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import "../css/Order.css";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminFlag = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(isAdminFlag);
  }, []);

  useEffect(() => {
    if (isAdmin !== null) {
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
      await axios.put(`http://localhost:5000/order/${orderId}/status`, {
        orderStatus: newStatus,
      });
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      );
      setOrders(updatedOrders);
      setError("Order status updated successfully");
      setSnackbarOpen(true);
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

  const downloadOrderPDF = (orderId) => {
    const orderElement = document.getElementById(`order-${orderId}`);
    if (!orderElement) return;

    const clone = orderElement.cloneNode(true);

    // Remove no-print elements like the download button
    clone.querySelectorAll(".no-print").forEach((el) => el.remove());

    const header = document.createElement("div");
    header.style.textAlign = "center";
    header.style.fontSize = "2rem";
    header.style.fontWeight = "bold";
    header.style.marginBottom = "20px";
    header.innerText = "AsnaKart";

    clone.insertBefore(header, clone.firstChild);

    const opt = {
      margin: 0.5,
      filename: `Order-${orderId.slice(-6)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(clone).save();
  };

  const handleAddReview = (product) => {
    setSelectedProduct(product);
    setReviewDialogOpen(true);
  };

  const handleReviewDialogClose = () => {
    setReviewDialogOpen(false);
    setSelectedProduct(null);
    setReviewText('');
    setReviewRating(5);
  };

  const handleReviewSubmit = async () => {
    if (!selectedProduct || !reviewText.trim()) {
      alert('Please enter a review comment');
      return;
    }

    setReviewLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("username") || "Anonymous";

      const res = await axios.post(`http://localhost:5000/product/${selectedProduct._id}/review`, {
        user: userId,
        userName: userName,
        rating: reviewRating,
        comment: reviewText
      });

      if (res.status === 201) {
        alert('✅ Review submitted successfully! Thank you for your feedback.');
        handleReviewDialogClose();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit review';
      alert(`❌ ${errorMessage}`);
      console.error('Error submitting review:', err);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (productId, reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const userId = localStorage.getItem("userId");

      const res = await axios.delete(`http://localhost:5000/product/${productId}/review/${reviewId}`, {
        data: { user: userId }
      });

      if (res.status === 200) {
        alert('✅ Review deleted successfully!');
        // Refresh the orders to update the review status
        getOrders(isAdmin);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete review';
      alert(`❌ ${errorMessage}`);
      console.error('Error deleting review:', err);
    }
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
            <div key={order._id} id={`order-${order._id}`} className="order-card">
              <div className="order-header">
                <div>
                  <h4>Order #{order._id.slice(-6)}</h4>
                  <p>{new Date(order.createdDate).toLocaleString()}</p>
                </div>
                <span className="chip">{order.orderStatus}</span>

                {/* Show review availability for delivered orders */}
                {!isAdmin && order.orderStatus === "Delivered" && (
                  <div style={{
                    backgroundColor: "#e8f5e8",
                    color: "#2e7d32",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginLeft: "10px"
                  }}>
                    ✍️ Reviews Available
                  </div>
                )}

                {isAdmin && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label htmlFor={`status-${order._id}`} className="status-label">
                      Status:
                    </label>
                    <select
                      id={`status-${order._id}`}
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
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
                        {!isAdmin && order.orderStatus === "Delivered" && <th>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(order.items)
                        ? order.items
                        : JSON.parse(order.items)
                      ).map((item) => (
                        <tr key={item._id}>
                          <td>
                            <button
                              onClick={() => navigate(`/product/${item._id}`)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#007bff",
                                textDecoration: "underline",
                                cursor: "pointer",
                                fontSize: "inherit",
                                fontFamily: "inherit",
                                padding: "0",
                                margin: "0"
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.color = "#0056b3";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.color = "#007bff";
                              }}
                            >
                              {item.title}
                            </button>
                          </td>
                          <td>₹{item.price}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price * item.quantity}</td>
                          {!isAdmin && order.orderStatus === "Delivered" && (
                            <td>
                              <button
                                onClick={() => handleAddReview(item)}
                                className="review-button"
                                style={{
                                  backgroundColor: "#4CAF50",
                                  color: "white",
                                  border: "none",
                                  padding: "8px 16px",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  boxShadow: "0 2px 4px rgba(76, 175, 80, 0.3)",
                                  transition: "all 0.3s ease",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px"
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor = "#45a049";
                                  e.target.style.transform = "translateY(-1px)";
                                  e.target.style.boxShadow = "0 4px 8px rgba(76, 175, 80, 0.4)";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor = "#4CAF50";
                                  e.target.style.transform = "translateY(0)";
                                  e.target.style.boxShadow = "0 2px 4px rgba(76, 175, 80, 0.3)";
                                }}
                              >
                                ✍️ Add Review
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="order-shipping">
                  <h5>Order By</h5>
                  <p>{order.firstName} {order.lastName}</p>
                  <h5>Shipping</h5>
                  <p>{order.address}</p>
                  <p>{order.zipCode}, {order.country}</p>
                  <p>+91 {order.mobileNumber}</p>
                </div>
              </div>

              {/* ✅ Download button, excluded from PDF via `no-print` class */}
              <button
                onClick={() => downloadOrderPDF(order._id)}
                className="download-button no-print"
              >
                📥 Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={handleReviewDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Review for {selectedProduct?.title}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <div>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Rating:
              </Typography>
              <Rating
                value={reviewRating}
                onChange={(_, val) => setReviewRating(val)}
                size="large"
              />
            </div>
            <TextField
              label="Your Review"
              multiline
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product..."
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReviewDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            color="primary"
            disabled={reviewLoading || !reviewText.trim()}
          >
            {reviewLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrdersPage;
