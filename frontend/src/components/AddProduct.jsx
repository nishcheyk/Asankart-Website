import React, { useState } from "react";
import {
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  IconButton,
  Chip,
  InputAdornment,
  Tooltip,
  Divider
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Image as ImageIcon,
  Info as InfoIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [productData, setProductData] = useState({
    title: "",
    brand: "",
    category: "",
    description: "",
    discountPercentage: "",
    images: [""],
    price: "",
    rating: "",
    stock: "",
    thumbnail: "",
  });

  const [errors, setErrors] = useState({});

  // Available categories from fake data
  const categories = [
    "Smartphones", "Laptops", "Audio", "Shoes", "TVs",
    "Cameras", "Tablets", "Drones", "Wearables", "Gaming", "Home Appliances"
  ];

  const validateField = (name, value) => {
    switch (name) {
      case "title":
        return value.length < 3 ? "Title must be at least 3 characters" : "";
      case "brand":
        return value.length < 2 ? "Brand must be at least 2 characters" : "";
      case "category":
        return !value ? "Please select a category" : "";
      case "description":
        return value.length < 10 ? "Description must be at least 10 characters" : "";
      case "price":
        return !value || value <= 0 ? "Price must be greater than 0" : "";
      case "stock":
        return !value || value < 0 ? "Stock must be 0 or greater" : "";
      case "rating":
        return value && (value < 0 || value > 5) ? "Rating must be between 0 and 5" : "";
      case "discountPercentage":
        return value && (value < 0 || value > 100) ? "Discount must be between 0 and 100" : "";
      default:
        return "";
    }
  };

  const handleInputChanges = (event) => {
    const { name, value } = event.target;
    const error = validateField(name, value);

    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const addImageField = () => {
    setProductData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }));
  };

  const removeImageField = (index) => {
    if (productData.images.length > 1) {
      const newImages = productData.images.filter((_, i) => i !== index);
      setProductData(prev => ({
        ...prev,
        images: newImages
      }));
    }
  };

  const updateImage = (index, value) => {
    const newImages = [...productData.images];
    newImages[index] = value;
    setProductData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(productData).forEach(key => {
      if (key !== "images") {
        const error = validateField(key, productData[key]);
        if (error) newErrors[key] = error;
      }
    });

    // Validate images - at least one required
    const validImages = productData.images.filter(img => img.trim() !== "");
    if (validImages.length === 0) {
      newErrors.images = "At least one image URL is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setError("Please fix the errors before saving");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/product/create",
        { data: productData }
      );
      if (response.data === "Product saved to the database!") {
        setSuccess("Product saved successfully!");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (e) {
      setError("Failed to save product. Please try again.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = Object.keys(errors).some(key => errors[key]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: { xs: 2, sm: 4 },
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: "800px",
          padding: { xs: 3, sm: 4 },
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#2c3e50",
              mb: 1,
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Add New Product
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details below to add a new product to your store
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: "#2c3e50", fontWeight: "600" }}>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Title"
              variant="outlined"
              fullWidth
              value={productData.title}
              name="title"
              onChange={handleInputChanges}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="Enter product title..."
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Brand"
              variant="outlined"
              fullWidth
              value={productData.brand}
              name="brand"
              onChange={handleInputChanges}
              error={!!errors.brand}
              helperText={errors.brand}
              placeholder="Enter brand name..."
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                value={productData.category}
                label="Category"
                name="category"
                onChange={handleInputChanges}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.category}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Stock Quantity"
              variant="outlined"
              fullWidth
              type="number"
              value={productData.stock}
              name="stock"
              onChange={handleInputChanges}
              error={!!errors.stock}
              helperText={errors.stock}
              placeholder="Enter stock quantity..."
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={productData.description}
              name="description"
              onChange={handleInputChanges}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Enter detailed product description..."
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, color: "#2c3e50", fontWeight: "600" }}>
              Pricing & Rating
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              type="number"
              value={productData.price}
              name="price"
              onChange={handleInputChanges}
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              placeholder="0"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Discount Percentage"
              variant="outlined"
              fullWidth
              type="number"
              value={productData.discountPercentage}
              name="discountPercentage"
              onChange={handleInputChanges}
              error={!!errors.discountPercentage}
              helperText={errors.discountPercentage}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              placeholder="0"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Rating"
              variant="outlined"
              fullWidth
              type="number"
              value={productData.rating}
              name="rating"
              onChange={handleInputChanges}
              error={!!errors.rating}
              helperText={errors.rating}
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              placeholder="0-5"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2, color: "#2c3e50", fontWeight: "600" }}>
              Images
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Thumbnail URL"
              variant="outlined"
              fullWidth
              value={productData.thumbnail}
              name="thumbnail"
              onChange={handleInputChanges}
              placeholder="Enter thumbnail image URL..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ImageIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Product Images
              </Typography>
              {productData.images.map((img, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1
                  }}
                >
                  <TextField
                    label={`Image ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    value={img}
                    onChange={(e) => updateImage(index, e.target.value)}
                    placeholder={`Enter image ${index + 1} URL...`}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ImageIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {productData.images.length > 1 && (
                    <IconButton
                      color="error"
                      onClick={() => removeImageField(index)}
                      sx={{ minWidth: 40 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
              {errors.images && (
                <Typography variant="caption" color="error" sx={{ ml: 1.5 }}>
                  {errors.images}
                </Typography>
              )}
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                onClick={addImageField}
                sx={{ mt: 1 }}
              >
                Add Another Image
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{ px: 4, py: 1.5 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={loading || hasErrors}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #5a6fd8, #6a4190)"
                  }
                }}
              >
                {loading ? "Saving..." : "Save Product"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AddProduct;
