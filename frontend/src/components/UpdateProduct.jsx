import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Update as UpdateIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import axios from "axios";
import "../css/AddProduct.css";

// UpdateProduct component - existing product update karne ke liye (admin functionality)
const UpdateProduct = () => {
  const { id } = useParams(); // URL se product ID extract karta hai
  const navigate = useNavigate(); // Navigation ke liye

  // Form data state - product details store karne ke liye
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    image: "",
  });

  // UI state variables
  const [loading, setLoading] = useState(false); // Loading state
  const [fetchLoading, setFetchLoading] = useState(true); // Initial data fetch loading
  const [error, setError] = useState(""); // Error message
  const [success, setSuccess] = useState(""); // Success message

  // Component mount hone par existing product data fetch karta hai
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Backend se product data fetch karta hai
        const response = await axios.get(`http://localhost:5000/product/${id}`);

        if (response.status === 200) {
          const product = response.data;

          // Form data set karta hai existing product details se
          setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price?.toString() || "",
            category: product.category || "",
            brand: product.brand || "",
            stock: product.stock?.toString() || "",
            image: product.image || product.images || "",
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product details. Please try again.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Form input change handle karne ka function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value // Form field update karta hai
    }));
  };

  // Form submit karne ka function - backend ko updated product data bhejta hai
  const handleSubmit = async (e) => {
    e.preventDefault(); // Default form submission rokta hai

    // Form validation - required fields check karta hai
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      setError("Please fill all required fields");
      return;
    }

    // Price validation - number check karta hai
    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price");
      return;
    }

    // Stock validation - number check karta hai
    if (formData.stock && (isNaN(formData.stock) || parseInt(formData.stock) < 0)) {
      setError("Please enter a valid stock quantity");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Backend ko updated product data bhejta hai
      const response = await axios.put(`http://localhost:5000/product/${id}`, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand || "",
        stock: formData.stock ? parseInt(formData.stock) : 0,
        image: formData.image || "",
      });

      if (response.status === 200) {
        setSuccess("Product updated successfully!");

        // Success message 3 seconds baad clear karta hai
        setTimeout(() => {
          setSuccess("");
          navigate('/admin/products'); // Admin products page par navigate karta hai
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError(error.response?.data?.message || "Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Back button - previous page par navigate karta hai
  const handleGoBack = () => {
    navigate(-1);
  };

  // Loading state - initial data fetch ke time
  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Update Product
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Product Form */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Product Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
              />
            </Grid>

            {/* Product Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>

            {/* Price and Category Row */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (₹) *"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                variant="outlined"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category *</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category *"
                >
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Clothing">Clothing</MenuItem>
                  <MenuItem value="Books">Books</MenuItem>
                  <MenuItem value="Home & Garden">Home & Garden</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="Beauty">Beauty</MenuItem>
                  <MenuItem value="Toys">Toys</MenuItem>
                  <MenuItem value="Automotive">Automotive</MenuItem>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Brand and Stock Row */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                variant="outlined"
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* Image URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                variant="outlined"
                placeholder="https://example.com/image.jpg"
                helperText="Enter a valid image URL (optional)"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleGoBack}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} /> : <UpdateIcon />}
                  disabled={loading}
                  sx={{ minWidth: '150px' }}
                >
                  {loading ? 'Updating...' : 'Update Product'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default UpdateProduct;
