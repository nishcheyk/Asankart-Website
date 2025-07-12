import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { addToCart } from "../store/cart/cartActions";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Rating,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack,
} from "@mui/material";
import {
  AddShoppingCart as AddShoppingCartIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";

// ProductCard component - individual product display card
const ProductCard = ({ product, isAdmin = false, onEdit, onDelete, onReorder }) => {
  const navigate = useNavigate(); // Navigation ke liye
  const dispatch = useDispatch(); // Redux dispatch function
  const { token, isAdmin: userIsAdmin } = useContext(AuthContext); // Auth context

  // Local state variables
  const [showDetails, setShowDetails] = useState(false); // Product details dialog
  const [loading, setLoading] = useState(false); // Loading state
  const [deleteConfirm, setDeleteConfirm] = useState(false); // Delete confirmation dialog

  // Product details dialog open karne ka function
  const handleShowDetails = () => {
    setShowDetails(true);
  };

  // Product details dialog close karne ka function
  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  // Cart mein product add karne ka function
  const handleAddToCart = () => {
    if (!token) {
      navigate('/login'); // Agar logged in nahi hai to login page
      return;
    }

    const product_item = {
      product: product,
      amount: 1, // Default quantity 1
    };
    dispatch(addToCart(product_item)); // Redux action dispatch karta hai
  };

  // Product details page par navigate karne ka function
  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  // Product edit karne ka function - admin ke liye
  const handleEdit = () => {
    if (onEdit) {
      onEdit(product);
    }
  };

  // Product delete karne ka function - admin ke liye
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setLoading(true);
    try {
      // Backend se product delete karta hai
      await axios.delete(`http://localhost:5000/product/${product._id}`);

      if (onDelete) {
        onDelete(product._id); // Parent component ko notify karta hai
      }

      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setLoading(false);
      setDeleteConfirm(false);
    }
  };

  // Product reorder karne ka function - admin ke liye
  const handleReorder = () => {
    if (onReorder) {
      onReorder(product);
    }
  };

  // Average rating calculate karta hai reviews se
  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <>
      {/* Product Card */}
      <Card
        sx={{
          maxWidth: 345,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 3,
          }
        }}
      >
        {/* Product Image */}
        <CardMedia
          component="img"
          height="200"
          image={product.image || product.images}
          alt={product.name || product.title}
          sx={{ objectFit: 'cover', cursor: 'pointer' }}
          onClick={handleProductClick} // Image click par product details
        />

        {/* Product Content */}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Product Title */}
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              cursor: 'pointer',
              '&:hover': { color: 'primary.main' }
            }}
            onClick={handleProductClick}
          >
            {product.name || product.title}
          </Typography>

          {/* Product Price */}
          <Typography variant="h6" color="primary" gutterBottom>
            ₹{product.price}
          </Typography>

          {/* Product Rating */}
          <Box display="flex" alignItems="center" mb={1}>
            <Rating
              value={averageRating}
              readOnly
              precision={0.5}
              size="small"
            />
            <Typography variant="body2" color="text.secondary" ml={1}>
              ({product.reviews?.length || 0} reviews)
            </Typography>
          </Box>

          {/* Product Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.description}
          </Typography>

          {/* Product Category */}
          {product.category && (
            <Chip
              label={product.category}
              size="small"
              color="secondary"
              sx={{ mb: 1, alignSelf: 'flex-start' }}
            />
          )}

          {/* Action Buttons */}
          <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
            {/* View Details Button */}
            <Button
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={handleShowDetails}
              variant="outlined"
            >
              Details
            </Button>

            {/* Add to Cart Button */}
            <Button
              size="small"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              variant="contained"
              color="primary"
              sx={{ flexGrow: 1 }}
            >
              Add to Cart
            </Button>
          </Box>

          {/* Admin Actions - sirf admin ke liye */}
          {isAdmin && (
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                color="primary"
                onClick={handleEdit}
                title="Edit Product"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={handleDelete}
                title="Delete Product"
                disabled={loading}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Product Details Dialog */}
      <Dialog
        open={showDetails}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {product.name || product.title}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Product Image */}
            <Grid item xs={12} md={6}>
              <img
                src={product.image || product.images}
                alt={product.name || product.title}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
            </Grid>

            {/* Product Details */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Typography variant="h5" color="primary">
                  ₹{product.price}
                </Typography>

                <Box display="flex" alignItems="center">
                  <Rating value={averageRating} readOnly precision={0.5} />
                  <Typography variant="body2" ml={1}>
                    ({product.reviews?.length || 0} reviews)
                  </Typography>
                </Box>

                <Typography variant="body1">
                  {product.description}
                </Typography>

                {product.category && (
                  <Chip label={product.category} color="secondary" />
                )}

                {product.brand && (
                  <Typography variant="body2" color="text.secondary">
                    Brand: {product.brand}
                  </Typography>
                )}

                {product.stock && (
                  <Typography variant="body2" color="text.secondary">
                    Stock: {product.stock} units
                  </Typography>
                )}
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
          <Button
            onClick={handleAddToCart}
            variant="contained"
            color="primary"
            startIcon={<AddShoppingCartIcon />}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductCard;
