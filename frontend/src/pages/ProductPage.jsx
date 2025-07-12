import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cart/cartActions';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../context/authContext';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import NavBar from "../components/NavBar";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Loader from '../components/Loader';
import axios from 'axios';
import Footer from '../components/Footer';

// ProductPage component - individual product ka detailed view
const ProductPage = () => {
  // URL se product ID extract karta hai
  const { id } = useParams();
  const navigate = useNavigate(); // Navigation ke liye
  const dispatch = useDispatch(); // Redux dispatch function
  const { token } = useContext(AuthContext); // Authentication context

  // State variables - different data store karne ke liye
  const [product, setProduct] = useState(null); // Current product data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [related, setRelated] = useState([]); // Related products
  const [reviewText, setReviewText] = useState(''); // Review text input
  const [reviewRating, setReviewRating] = useState(5); // Review rating
  const [canReview, setCanReview] = useState(false); // Can user review
  const [reviewLoading, setReviewLoading] = useState(false); // Review submit loading
  const [confirmShow, setConfirmShow] = useState(false); // Checkout confirmation dialog
  const [purchaseStatus, setPurchaseStatus] = useState(null); // Purchase status

  const amountInputRef = useRef(); // Quantity input reference

  // Component mount hone par product data fetch karta hai
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Backend se product data fetch karta hai
        const res = await fetch(`http://localhost:5000/product/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);

        // Related products fetch karta hai same category se
        if (data.category) {
          const relRes = await fetch(`http://localhost:5000/product?category=${encodeURIComponent(data.category)}`);
          if (relRes.ok) {
            const relData = await relRes.json();
            // Current product ko filter out karta hai aur 6 related products limit karta hai
            setRelated(relData.filter(p => p._id !== data._id).slice(0, 6));
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Check karta hai ki user review kar sakta hai ya nahi
  useEffect(() => {
    const checkReviewEligibility = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("username");

      // Agar user logged in nahi hai to review nahi kar sakta
      if (!token || !userId || !userName) {
        setCanReview(false);
        return;
      }

      // Check karta hai ki user ne already review diya hai ya nahi
      const existingReview = product?.reviews?.find(review =>
        review.user === userId || review.userName === userName
      );

      setCanReview(!existingReview); // Agar review nahi diya hai to true
    };

    if (product) {
      checkReviewEligibility();
    }
  }, [id, product]);

  // Cart mein product add karne ka function
  const handleAddToCart = () => {
    const product_item = {
      product: product,
      amount: amountInputRef.current.value || 1, // Quantity input se value ya default 1
    };
    dispatch(addToCart(product_item)); // Redux action dispatch karta hai
    alert('Added to cart!');
  };

  // Checkout function - cart page par navigate karta hai
  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login'); // Agar logged in nahi hai to login page
    } else {
      setConfirmShow(true); // Confirmation dialog show karta hai
    }
  };

  // Cancel checkout - dialog close karta hai
  const handleCancel = () => {
    setConfirmShow(false);
  };

  // Confirm checkout - cart page par navigate karta hai
  const handleConfirm = async () => {
    setConfirmShow(false);
    navigate('/cart');
  };

  // Review submit karne ka function
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("username") || "Anonymous";

      // Backend ko review data bhejta hai
      const res = await axios.post(`http://localhost:5000/product/${id}/review`, {
        user: userId,
        userName: userName,
        rating: reviewRating,
        comment: reviewText
      });

      if (res.status === 201) {
        // Product state mein new review add karta hai
        setProduct(prev => ({
          ...prev,
          reviews: [...(prev.reviews || []), res.data.review]
        }));
        setReviewText(''); // Form clear karta hai
        setReviewRating(5); // Rating reset karta hai

        // Success message show karta hai
        alert('✅ Review submitted successfully! Thank you for your feedback.');

        // Reviews section par scroll karta hai
        setTimeout(() => {
          const reviewsSection = document.querySelector('[data-reviews-section]');
          if (reviewsSection) {
            reviewsSection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit review';
      alert(`❌ ${errorMessage}`);
      console.error('Error submitting review:', err);
    } finally {
      setReviewLoading(false);
    }
  };

  // Review delete karne ka function
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const userId = localStorage.getItem("userId");

      // Backend se review delete karta hai
      const res = await axios.delete(`http://localhost:5000/product/${id}/review/${reviewId}`, {
        data: { user: userId }
      });

      if (res.status === 200) {
        // Product state se review remove karta hai
        setProduct(prev => ({
          ...prev,
          reviews: prev.reviews.filter(review => review._id !== reviewId)
        }));

        alert('✅ Review deleted successfully!');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete review';
      alert(`❌ ${errorMessage}`);
      console.error('Error deleting review:', err);
    }
  };

  // Related product par click karne ka function
  const handleRelatedProductClick = (productId) => {
    // Navigation se pehle top par scroll karta hai
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/product/${productId}`);
  };

  // Reviews se average rating calculate karta hai
  const avgRating = product && product.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length)
    : 0;

  // Loading state - spinner show karta hai
  if (loading) {
    return <Loader />;
  }

  // Error state - error message show karta hai
  if (error) {
    return (
      <div>
        <NavBar />
        <div className="error-container">
          <h2>Error: {error}</h2>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  // Product nahi mila to error show karta hai
  if (!product) {
    return (
      <div>
        <NavBar />
        <div className="error-container">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <NavBar />

      {/* Main product details section */}
      <div className="product-container">
        <Grid container spacing={3}>
          {/* Product image section */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="400"
                image={product.image}
                alt={product.name}
                style={{ objectFit: 'cover' }}
              />
            </Card>
          </Grid>

          {/* Product info section */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {product.name}
                </Typography>

                {/* Rating display */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Rating value={avgRating} readOnly precision={0.5} />
                  <Typography variant="body2" ml={1}>
                    ({product.reviews?.length || 0} reviews)
                  </Typography>
                </Box>

                <Typography variant="h5" color="primary" gutterBottom>
                  ₹{product.price}
                </Typography>

                <Typography variant="body1" paragraph>
                  {product.description}
                </Typography>

                {/* Quantity input */}
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Typography>Quantity:</Typography>
                  <TextField
                    type="number"
                    inputRef={amountInputRef}
                    defaultValue={1}
                    min={1}
                    max={10}
                    size="small"
                    style={{ width: '80px' }}
                  />
                </Stack>

                {/* Action buttons */}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCheckout}
                  >
                    Buy Now
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Reviews section */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom data-reviews-section>
              Reviews ({product.reviews?.length || 0})
            </Typography>

            {/* Review form - agar user review kar sakta hai */}
            {canReview && (
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Write a Review
                </Typography>
                <form onSubmit={handleReviewSubmit}>
                  <Stack spacing={2}>
                    <Rating
                      value={reviewRating}
                      onChange={(event, newValue) => setReviewRating(newValue)}
                      size="large"
                    />
                    <TextField
                      multiline
                      rows={3}
                      placeholder="Write your review..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={reviewLoading}
                    >
                      {reviewLoading ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </Stack>
                </form>
              </Box>
            )}

            {/* Reviews list */}
            {product.reviews && product.reviews.length > 0 ? (
              <Stack spacing={2}>
                {product.reviews.map((review, index) => (
                  <Card key={review._id || index} variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1">
                          {review.userName}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {review.comment}
                      </Typography>
                      {/* Delete button - agar user ne ye review diya hai */}
                      {review.user === localStorage.getItem("userId") && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteReview(review._id)}
                          sx={{ mt: 1 }}
                        >
                          Delete
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No reviews yet. Be the first to review this product!
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Related products section */}
        {related.length > 0 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Related Products
              </Typography>
              <Grid container spacing={2}>
                {related.map((relatedProduct) => (
                  <Grid item xs={12} sm={6} md={4} key={relatedProduct._id}>
                    <ProductCard
                      product={relatedProduct}
                      onClick={() => handleRelatedProductClick(relatedProduct._id)}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Checkout confirmation dialog */}
      <Dialog open={confirmShow} onClose={handleCancel}>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to proceed to checkout with this item?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} variant="contained">
            Proceed to Cart
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProductPage;