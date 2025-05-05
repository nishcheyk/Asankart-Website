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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  AccountCircle,
  Home as HomeIcon,
  Flag as FlagIcon,
  LocationCity as LocationCityIcon,
  MarkunreadMailbox,
  LocalMall as LocalMallIcon,
} from "@mui/icons-material";
import NavBar from "../components/NavBar";
import { addToCart, removeFromCart } from "../store/cart/cartActions";
import axios from "axios";
import LoginForm from "../pages/AuthPage";
import RegisterForm from "../pages/AuthPage";
import emptyCart from "../img/emptycart.png";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);
  const addedItems = useSelector((state) => state.cartStore.addedItems);
  const total = useSelector((state) => state.cartStore.total);
  const [totalAmount, setTotalAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [accountDialog, setAccountDialog] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const isMobile = useMediaQuery("(max-width:768px)");

  const [checkoutForm, setCheckoutForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    mobileNumber: "", // Added mobile number
  });

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
    const { mobileNumber } = checkoutForm;
    const isValidMobile = /^[0-9]{10}$/.test(mobileNumber);

    if (!isValidMobile) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!authContext.token) {
      setOpen(true);
    } else {
      setConfirmShow(true);
    }
  };

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    setCheckoutForm({ ...checkoutForm, [name]: value });
  };

  const handleGoToLogin = () => {
    setShowLogin(true);
    setAccountDialog(true);
    setOpen(false);
  };

  const handleCreateAccount = () => {
    setShowLogin(false);
    setAccountDialog(true);
    setOpen(false);
  };

  const handleCloseAccountDialog = () => {
    setAccountDialog(false);
    setConfirmShow(true);
  };

  const handleCancel = () => {
    setConfirmShow(false);
  };

  const handleConfirm = async () => {
    const order = {
      userID: localStorage.getItem("userId"),
      ...checkoutForm,
      totalAmount,
      items: addedItems,
      createdDate: new Date(),
    };

    try {
      const response = await axios.post("http://localhost:5000/order/create", {
        data: order,
      });

      if (response.data.message === "Order saved to the database") {
        dispatch({ type: "CLEAR_CART" }); // Clear the cart
        setConfirmShow(false);
        navigate("/order");
      }
    } catch (e) {
      console.log(e);
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

          {/* Checkout Form */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" align="center" gutterBottom>
                Checkout form
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={checkoutForm.firstName}
                    onChange={handleFormInput}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={checkoutForm.lastName}
                    onChange={handleFormInput}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    name="address"
                    value={checkoutForm.address}
                    onChange={handleFormInput}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    name="city"
                    value={checkoutForm.city}
                    onChange={handleFormInput}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCityIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Country"
                    name="country"
                    value={checkoutForm.country}
                    onChange={handleFormInput}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FlagIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Zip code"
                    name="zipCode"
                    value={checkoutForm.zipCode}
                    onChange={handleFormInput}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MarkunreadMailbox />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Mobile Number Field */}
                <Grid item xs={12}>
                  <TextField
                    label="Mobile Number"
                    name="mobileNumber"
                    value={checkoutForm.mobileNumber}
                    onChange={handleFormInput}
                    fullWidth
                    inputProps={{ maxLength: 10 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircle />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} textAlign="center">
                  <Button variant="contained" onClick={handleCheckout}>
                    Checkout
                  </Button>
                </Grid>
              </Grid>
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

      {/* Login / Register Prompt */}
      <Dialog open={open}>
        <DialogTitle>Do you have an account?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCreateAccount} variant="contained" color="secondary">
            Create
          </Button>
          <Button onClick={handleGoToLogin} variant="contained" color="primary" autoFocus>
            Login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Auth Dialog */}
      <Dialog open={accountDialog} onClose={handleCloseAccountDialog}>
        <DialogContent>
          {showLogin ? (
            <LoginForm closeForm={handleCloseAccountDialog} />
          ) : (
            <RegisterForm closeForm={handleCloseAccountDialog} />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Order Dialog */}
      <Dialog open={confirmShow} onClose={handleCancel}>
        <DialogTitle>Confirm your order?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancel} variant="contained" color="error">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="success" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartPage;
