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
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: 2,
        width: "100%",
        background: "#DAD2FF",
        p: 2,
        my: 2,
      }}
    >
      {/* Image Section */}
      <Card
        sx={{
          width: { xs: "100%", sm: 250, md: 300 },
          height: { xs: 180, sm: 200 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          m: "auto",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
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
          }}
        />
      </Card>

      {/* Text Content */}
      <Card
        sx={{
          width: { xs: "100%", md: "60%" },
          height: "100%",
          mx: { xs: 0, md: 2 },
        }}
      >
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">{product.title}</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
                maxHeight: "48px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {product.description}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Rating
                name="half-rating-read"
                value={product.rating}
                precision={0.5}
                readOnly
              />
              <Typography variant="body2" color="text.primary">
                {product.rating}
              </Typography>
            </Stack>

            <Stack direction="column">
              <Typography variant="h6" color="text.primary">
                ₹ {product.price}
              </Typography>
              <Typography variant="body2" color="text.primary">
                Price discount: {product.discountPercentage}%
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Actions */}
      <CardActions
        sx={{
          mx: 2,
          width: { xs: "100%", md: "auto" },
          justifyContent: { xs: "space-between", md: "flex-end" },
          flexWrap: "wrap",
        }}
      >
        {token && isAdmin === "true" ? (
          <Stack direction="row" spacing={1}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => handleUpdate(product._id)}
            >
              Update
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => handleDelete(product._id)}
            >
              Delete
            </Button>
          </Stack>
        ) : (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            spacing={1}
            sx={{ width: "100%" }}
          >
            <Button
              variant="contained"
              color="primary"
              endIcon={<AddShoppingCartIcon />}
              onClick={() => handleAddToCart(product)}
              sx={{ borderRadius: "40px", width: { xs: "100%", sm: "auto" } }}
            >
              + Add
            </Button>
            <TextField
              inputRef={amountInputRef}
              sx={{ width: { xs: "100%", sm: 80 } }}
              label="Amount"
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
      </CardActions>
    </Card>
  );
};

export default ProductCard;
