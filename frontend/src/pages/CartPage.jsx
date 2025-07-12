import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import {
  Grid,
  Button,
  Paper,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  TableBody,
  Table,
  IconButton,
  Typography,
  Stack,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  useMediaQuery,
  TextField,
  Box,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  LocalMall as LocalMallIcon,
} from "@mui/icons-material";
import NavBar from "../components/NavBar";
import { addToCart, removeFromCart } from "../store/cart/cartActions";
import axios from "axios";
import emptyCart from "../img/emptycart.png";

// CartPage component - shopping cart ka complete functionality
const CartPage = () => {
  const navigate = useNavigate(); // Navigation ke liye
  const dispatch = useDispatch(); // Redux dispatch function
  const authContext = useContext(AuthContext); // Authentication context

  // Redux store se cart data fetch karta hai
  const addedItems = useSelector((state) => state.cartStore.addedItems); // Cart mein jo items hain
  const total = useSelector((state) => state.cartStore.total); // Total amount

  // Local state variables
  const [totalAmount, setTotalAmount] = useState(0); // Formatted total amount
  const [confirmShow, setConfirmShow] = useState(false); // Confirmation dialog
  const [orderFormShow, setOrderFormShow] = useState(false); // Order form dialog
  const [orderForm, setOrderForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    mobileNumber: "",
  }); // Order form data
  const [orderLoading, setOrderLoading] = useState(false); // Order submit loading
  const isMobile = useMediaQuery("(max-width:768px)"); // Mobile responsive check

  // Total amount update karta hai jab cart change hota hai
  useEffect(() => {
    if (total !== undefined) {
      setTotalAmount(parseFloat(total).toFixed(2)); // 2 decimal places format
    }
  }, [total, addedItems]);

  // Back button - home page par navigate karta hai
  const goBack = () => navigate("/");

  // Cart se item remove karne ka function
  const cartItemRemoveHandler = (id) => {
    dispatch(removeFromCart(id)); // Redux action dispatch karta hai
  };

  // Cart mein item add karne ka function
  const cartItemAddHandler = (item) => {
    // Maximum quantity check - 5 se zyada nahi allow karta
    if (item.quantity >= 5) {
      alert("Maximum quantity of 5 reached for this item.");
      return;
    }
    const product_item = { product: item, amount: 1 };
    dispatch(addToCart(product_item)); // Redux action dispatch karta hai
  };

  // Checkout function - order form show karta hai
  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login'); // Agar logged in nahi hai to login page
    } else {
      setOrderFormShow(true); // Order form dialog show karta hai
    }
  };

  // Cancel function - dialogs close karta hai
  const handleCancel = () => {
    setConfirmShow(false);
    setOrderFormShow(false);
  };

  // Order form input change handle karta hai
  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value // Form field update karta hai
    }));
  };

  // Order place karne ka function - backend ko order data bhejta hai
  const handlePlaceOrder = async () => {
    setOrderLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      // Order data prepare karta hai
      const orderData = {
        userID: userId,
        firstName: orderForm.firstName,
        lastName: orderForm.lastName,
        address: orderForm.address,
        city: orderForm.city,
        country: orderForm.country,
        zipCode: orderForm.zipCode,
        mobileNumber: orderForm.mobileNumber,
        totalAmount: totalAmount.toString(),
        items: addedItems, // Cart items
        createdDate: new Date(), // Current date
      };

      // Backend ko order data bhejta hai
      const response = await axios.post("http://localhost:5000/order/create", {
        data: orderData
      });

      if (response.status === 201) {
        alert("Order placed successfully!");
        dispatch({ type: 'CLEAR_CART' }); // Cart clear karta hai
        setOrderFormShow(false); // Dialog close karta hai
        navigate('/order'); // Orders page par navigate karta hai
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <>
      <NavBar />

      {/* Cart content - agar items hain to show karta hai */}
      {addedItems.length ? (
        <Grid
          container
          spacing={4}
          direction={isMobile ? "column" : "row"}
          justifyContent="center"
          alignItems="flex-start"
          sx={{ p: 3 }}
        >
          {/* Cart Items Table */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ width: "100%" }}>
              <TableContainer sx={{ maxHeight: 500 }}>
                <Table aria-label="cart table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Cart items list */}
                    {addedItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Stack direction="row" gap={1} alignItems="center">
                            <Avatar src={item.images} variant="square" />
                            {item.title}
                          </Stack>
                        </TableCell>
                        <TableCell>₹{item.price}</TableCell>
                        <TableCell>
                          <Stack direction="row" gap={2} alignItems="center">
                            {/* Add button */}
                            <IconButton onClick={() => cartItemAddHandler(item)}>
                              <AddIcon />
                            </IconButton>
                            <Typography>{item.quantity}</Typography>
                            {/* Remove button */}
                            <IconButton onClick={() => cartItemRemoveHandler(item._id)}>
                              <RemoveIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* Total amount display */}
              <Card sx={{ backgroundColor: "#2196f3", p: 2, mt: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="white">Total amount:</Typography>
                  <Typography color="white">₹{totalAmount}</Typography>
                </Stack>
              </Card>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              {/* Order details */}
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Items ({addedItems.length}):</Typography>
                  <Typography>₹{totalAmount}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Shipping:</Typography>
                  <Typography>Free</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6">₹{totalAmount}</Typography>
                </Box>
              </Stack>

              {/* Action buttons */}
              <Stack spacing={2} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCheckout}
                  startIcon={<LocalMallIcon />}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={goBack}
                >
                  Continue Shopping
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        /* Empty cart state */
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="60vh"
          gap={3}
        >
          <img src={emptyCart} alt="Empty Cart" style={{ width: '200px' }} />
          <Typography variant="h5" color="text.secondary">
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={goBack}
          >
            Start Shopping
          </Button>
        </Box>
      )}

      {/* Order Form Dialog */}
      <Dialog open={orderFormShow} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Shipping Information</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {/* Form fields */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={orderForm.firstName}
                  onChange={handleOrderFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={orderForm.lastName}
                  onChange={handleOrderFormChange}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Address"
              name="address"
              value={orderForm.address}
              onChange={handleOrderFormChange}
              multiline
              rows={2}
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={orderForm.city}
                  onChange={handleOrderFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={orderForm.country}
                  onChange={handleOrderFormChange}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  name="zipCode"
                  value={orderForm.zipCode}
                  onChange={handleOrderFormChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobileNumber"
                  value={orderForm.mobileNumber}
                  onChange={handleOrderFormChange}
                  required
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            onClick={handlePlaceOrder}
            variant="contained"
            disabled={orderLoading}
          >
            {orderLoading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartPage;
