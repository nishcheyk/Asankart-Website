import React, { useState } from "react";
import { Grid, Paper, TextField, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
  const navigate = useNavigate();
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

  const handleInputChanges = (event) => {
    const { name, value } = event.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    console.log(productData);
    try {
      const response = await axios.post(
        "http://localhost:5000/product/create",
        { data: productData }
      );
      if (response.data === "Product saved to the database!") {
        navigate("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "600px",
          padding: "30px",
          background: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ textAlign: "center", fontWeight: "bold", color: "#333", mb: 2 }}
        >
          Add Product
        </Typography>

        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={productData.title}
              name="title"
              onChange={handleInputChanges}
            />
            <TextField
              label="Brand"
              variant="outlined"
              fullWidth
              margin="normal"
              value={productData.brand}
              name="brand"
              onChange={handleInputChanges}
            />
            <TextField
              label="Category"
              variant="outlined"
              fullWidth
              margin="normal"
              value={productData.category}
              name="category"
              onChange={handleInputChanges}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              value={productData.description}
              name="description"
              onChange={handleInputChanges}
            />
            <TextField
              label="Discount Percentage"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={productData.discountPercentage}
              name="discountPercentage"
              onChange={handleInputChanges}
            />
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} sm={6}>
            <div>
              <TextField
                label="Price"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={productData.price}
                name="price"
                onChange={handleInputChanges}
              />
              <TextField
                label="Rating"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={productData.rating}
                name="rating"
                onChange={handleInputChanges}
              />
              <TextField
                label="Stock"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={productData.stock}
                name="stock"
                onChange={handleInputChanges}
              />
              <TextField
                label="Thumbnail"
                variant="outlined"
                fullWidth
                margin="normal"
                value={productData.thumbnail}
                name="thumbnail"
                onChange={handleInputChanges}
              />
            </div>
          </Grid>

          <Grid item xs={12}>
            {productData.images.map((img, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "70%",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <TextField
                  label={`Image ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  margin="normal"s
                  value={img}
                  onChange={(e) => {
                    const newImages = [...productData.images];
                    newImages[index] = e.target.value;
                    setProductData({ ...productData, images: newImages });
                  }}
                />

                {/* Add Image button only next to the first input field */}
                {index === 0 && (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "white",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      "&:hover": { backgroundColor: "#1565c0" },
                    }}
                    onClick={() =>
                      setProductData({
                        ...productData,
                        images: [...productData.images, ""],
                      })
                    }
                  >
                    Add Image
                  </Button>
                )}
              </div>
            ))}
          </Grid>

          <Button
            variant="contained"
            sx={{
              marginTop: "20px",
              width: "100%",
              backgroundColor: "#28a745",
              color: "white",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              "&:hover": { backgroundColor: "#218838" },
            }}
            onClick={handleSave}
          >
            Save Product
          </Button>
        </Grid>
      </Paper>
    </div>
  );
};

export default AddProduct;
