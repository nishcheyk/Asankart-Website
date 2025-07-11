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

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  const addedItems = useSelector((state) => state.cartStore.addedItems);
  const total = useSelector((state) => state.cartStore.total);
  const [totalAmount, setTotalAmount] = useState(0);
  const [confirmShow, setConfirmShow] = useState(false);
  const [orderFormShow, setOrderFormShow] = useState(false);
  const [orderForm, setOrderForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    mobileNumber: "",
  });
  const [orderLoading, setOrderLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    if (total !== undefined) {
      setTotalAmount(parseFloat(total).toFixed(2));
    }
  }, [total, addedItems]);

  const goBack = () => navigate("/");

  const cartItemRemoveHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const cartItemAddHandler = (item) => {
    if (item.quantity >= 5) {
      alert("Maximum quantity of 5 reached for this item.");
      return;
    }
    const product_item = { product: item, amount: 1 };
    dispatch(addToCart(product_item));
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
    } else {
      setOrderFormShow(true);
    }
  };

  const handleCancel = () => {
    setConfirmShow(false);
    setOrderFormShow(false);
  };

  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async () => {
    setOrderLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

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
        items: addedItems,
        createdDate: new Date(),
      };

      const response = await axios.post("http://localhost:5000/order/create", {
        data: orderData
      });

      if (response.status === 201) {
        alert("Order placed successfully!");
        dispatch({ type: 'CLEAR_CART' });
        setOrderFormShow(false);
        navigate('/order');
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

      {addedItems.length ? (
        <Grid
          container
          spacing={4}
          direction={isMobile ? "column" : "row"}
          justifyContent="center"
          alignItems="flex-start"
          sx={{ p: 3 }}
        >
          {/* Cart Items */}
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
                            <IconButton onClick={() => cartItemAddHandler(item)}>
                              <AddIcon />
                            </IconButton>
                            <Typography>{item.quantity}</Typography>
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
              <Card sx={{ backgroundColor: "#2196f3", p: 2, mt: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="white">Total amount:</Typography>
                  <Typography color="white">₹{totalAmount}</Typography>
                </Stack>
              </Card>
            </Paper>
          </Grid>

          {/* Checkout Button */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" align="center" gutterBottom>
                Ready to Checkout?
              </Typography>
              <Typography variant="body2" align="center" sx={{ mb: 3 }}>
                Click the button below to complete your purchase.
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleCheckout}
                sx={{ py: 2 }}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ pt: 4 }}
        >
          <Button variant="contained" onClick={goBack} endIcon={<LocalMallIcon />}>
            Back to shop
          </Button>
          <img src={emptyCart} alt="empty cart" style={{ maxWidth: 300, marginTop: 16 }} />
        </Grid>
      )}

      {/* Order Form Dialog */}
      <Dialog open={orderFormShow} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>Complete Your Order</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
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
              <Grid item xs={12}>
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
              </Grid>
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
                  helperText="Enter 10-digit mobile number"
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Typography>Total Amount: ₹{totalAmount}</Typography>
              <Typography variant="body2" color="text.secondary">
                {addedItems.length} item(s) in your order
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handlePlaceOrder}
            variant="contained"
            color="primary"
            disabled={orderLoading || !orderForm.firstName || !orderForm.lastName || !orderForm.address || !orderForm.city || !orderForm.country || !orderForm.zipCode || !orderForm.mobileNumber}
          >
            {orderLoading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartPage;
