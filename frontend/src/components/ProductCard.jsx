import React, { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { useMediaQuery } from "@mui/material";

import { addToCart, removeFromCart } from "../store/cart/cartActions";
import { useDispatch } from "react-redux";
import axios from "axios";

const ProductCard = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(props.product);
  const [token, setToken] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const amountInputRef = useRef();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  let imageInterval = useRef(null);

  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setIsAdmin(localStorage.getItem("isAdmin"));
  }, []);

  useEffect(() => {
    if (hovered && product?.images?.length > 1) {
      imageInterval.current = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % product.images.length
        );
      }, 1500);
    } else {
      clearInterval(imageInterval.current);
      imageInterval.current = null;
      setCurrentImageIndex(0);
    }
    return () => clearInterval(imageInterval.current);
  }, [hovered, product?.images]);

  const handleUpdate = (id) => {
    navigate("/update/" + id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/product/delete/" + id
      );
      if (
        response.data === "Product deleted successfully!" ||
        response.data === "Product deleted!"
      ) {
        if (props.getProduct) props.getProduct();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddToCart = (product) => {
    const product_item = {
      product: product,
      amount: amountInputRef.current.value,
    };
    dispatch(addToCart(product_item));
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        gap: { xs: 1.5, md: 3 },
        width: "100%",
        background: "linear-gradient(135deg, #f8f9ff 0%, #e8ecff 100%)",
        borderRadius: "16px",
        p: { xs: 1.5, sm: 2.5 },
        my: 1.5,
        minHeight: { xs: "auto", md: 220 },
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      {/* Image Section */}
      <Card
        sx={{
          width: { xs: "100%", sm: 280, md: 280 },
          height: { xs: 220, sm: 220, md: 220 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          m: { xs: "auto", md: 0 },
          cursor: "pointer",
          flexShrink: 0,
          borderRadius: "12px",
          background: "white",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        <CardMedia
          component="img"
          image={product?.images?.[currentImageIndex] || product?.thumbnail}
          alt="Product image"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            transition: "opacity 0.5s ease-in-out",
            backgroundColor: "transparent",
            filter: "drop-shadow(0 0 0 transparent)",
            padding: "8px",
          }}
        />
      </Card>

      {/* Text Content */}
      <Card
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: { xs: "auto", md: 220 },
          background: "transparent",
          boxShadow: "none",
          minWidth: { md: "300px" },
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, sm: 2.5 }, flex: 1 }}>
          <Stack spacing={1.5}>
            <Typography
              variant="h6"
              sx={{
                cursor: "pointer",
                fontSize: { xs: "1.1rem", sm: "1.3rem" },
                fontWeight: 600,
                lineHeight: 1.3,
                color: "#2c3e50",
                transition: "color 0.2s ease",
                "&:hover": {
                  color: "#3498db",
                },
              }}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              {product.title}
            </Typography>
            {!isMobile && (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    maxHeight: { xs: "70px", sm: "90px" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: { xs: 3, sm: 4 },
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.5,
                    color: "#5a6c7d",
                  }}
                >
                  {product.description}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Rating
                    name="half-rating-read"
                    value={product.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: "#f39c12",
                      },
                      "& .MuiRating-iconHover": {
                        color: "#f39c12",
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                      fontWeight: 500,
                      color: "#34495e",
                    }}
                  >
                    {product.rating}
                  </Typography>
                  {product.reviews && product.reviews.length > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.7rem",
                        color: "#7f8c8d",
                      }}
                    >
                      ({product.reviews.length} reviews)
                    </Typography>
                  )}
                </Stack>
                <Stack direction="column" spacing={0.8}>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{
                      fontSize: { xs: "1.2rem", sm: "1.4rem" },
                      fontWeight: 700,
                      color: "#e74c3c",
                    }}
                  >
                    ₹ {product.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                      color: "#27ae60",
                      fontWeight: 500,
                    }}
                  >
                    Save {product.discountPercentage}% off
                  </Typography>
                </Stack>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Cart Actions - Now positioned on the right */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", sm: "column" },
          justifyContent: { xs: "space-between", sm: "center" },
          alignItems: { xs: "center", sm: "center" },
          gap: { xs: 1.5, sm: 1.5 },
          p: { xs: 1.5, sm: 2.5 },
          width: { xs: "100%", md: "auto" },
          flexShrink: 0,
          minWidth: { md: "220px" },
          maxWidth: { md: "250px" },
        }}
      >
        {token && isAdmin === "true" ? (
          <Stack
            direction={{ xs: "row", sm: "column" }}
            spacing={1.5}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={() => handleUpdate(product._id)}
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                px: { xs: 1.5, sm: 2.5 },
                borderRadius: "8px",
                fontWeight: 600,
                background: "linear-gradient(135deg, #3498db, #2980b9)",
                "&:hover": {
                  background: "linear-gradient(135deg, #2980b9, #1f5f8b)",
                },
              }}
            >
              Update
            </Button>
            <Button
              color="error"
              variant="contained"
              size="small"
              onClick={() => handleDelete(product._id)}
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                px: { xs: 1.5, sm: 2.5 },
                borderRadius: "8px",
                fontWeight: 600,
                background: "linear-gradient(135deg, #e74c3c, #c0392b)",
                "&:hover": {
                  background: "linear-gradient(135deg, #c0392b, #a93226)",
                },
              }}
            >
              Delete
            </Button>
          </Stack>
        ) : (
          <Stack
            direction={{ xs: "row", sm: "column" }}
            alignItems="center"
            spacing={1.5}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              variant="contained"
              color="primary"
              endIcon={<AddShoppingCartIcon />}
              onClick={() => handleAddToCart(product)}
              size="small"
              sx={{
                borderRadius: "25px",
                width: { xs: "auto", sm: "100%" },
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                px: { xs: 2, sm: 2.5 },
                fontWeight: 600,
                background: "linear-gradient(135deg, #27ae60, #2ecc71)",
                boxShadow: "0 2px 8px rgba(39, 174, 96, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #2ecc71, #27ae60)",
                  boxShadow: "0 4px 12px rgba(39, 174, 96, 0.4)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Add to Cart
            </Button>
            <TextField
              inputRef={amountInputRef}
              size="small"
              sx={{
                width: { xs: 90, sm: 110 },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3498db",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3498db",
                  },
                },
              }}
              label="Qty"
              id={"amount_" + product._id}
              type="number"
              inputProps={{ min: 1, max: 10, step: 1 }}
              defaultValue={1}
              onChange={(e) => {
                if (e.target.value > 5) e.target.value = 5;
              }}
            />
          </Stack>
        )}
      </Box>
    </Card>
  );
};

export default ProductCard;
