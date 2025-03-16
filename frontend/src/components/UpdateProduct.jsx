import React, { useEffect, useState } from "react";
import { Grid, Paper, TextField, Typography, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({ images: [] });

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/product/${id}`);
      const product = response.data;

      // Ensure images are stored as an array
      const imagesArray = product.images
        ? typeof product.images === "string"
          ? product.images.split(",").map((img) => img.trim())
          : product.images
        : [];

      setProductData({ ...product, images: imagesArray });
    } catch (e) {
      console.log(e);
    }
  };

  const handleInputChanges = (event) => {
    const { name, value } = event.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (event, index) => {
    const newImages = [...productData.images];
    newImages[index] = event.target.value;
    setProductData({ ...productData, images: newImages });
  };

  const addNewImageField = () => {
    setProductData({ ...productData, images: [...productData.images, ""] });
  };

  const handleUpdate = async () => {
    try {
      const updatedProduct = {
        ...productData,
        images: productData.images
          .filter((img) => img.trim() !== "")
          .join(", "), // Convert array back to string
      };

      const response = await axios.put(
        `http://localhost:5000/product/update/${id}`,
        updatedProduct
      );

      if (response.data === "Product updated successfully!") {
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
          Update Product
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={productData.title || ""}
              name="title"
              onChange={handleInputChanges}
            />
            <TextField
              label="Brand"
              variant="outlined"
              fullWidth
              margin="normal"
              value={productData.brand || ""}
              name="brand"
              onChange={handleInputChanges}
            />
            <TextField
              label="Category"
              variant="outlined"
              fullWidth
              margin="normal"
              value={productData.category || ""}
              name="category"
              onChange={handleInputChanges}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              value={productData.description || ""}
              name="description"
              onChange={handleInputChanges}
            />
            <TextField
              label="Discount Percentage"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={productData.discountPercentage || ""}
              name="discountPercentage"
              onChange={handleInputChanges}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={productData.price || ""}
              name="price"
              onChange={handleInputChanges}
            />
            <TextField
              label="Rating"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={productData.rating || ""}
              name="rating"
              onChange={handleInputChanges}
            />
            <TextField
              label="Stock"
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={productData.stock || ""}
              name="stock"
              onChange={handleInputChanges}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Images</Typography>
            {productData.images.map((image, index) => (
              <TextField
                key={index}
                label={`Image ${index + 1}`}
                variant="outlined"
                fullWidth
                margin="normal"
                value={image || ""}
                onChange={(e) => handleImageChange(e, index)}
              />
            ))}
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={addNewImageField}
            >
              Add More Images
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleUpdate}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default UpdateProduct;
