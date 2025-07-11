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

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [canReview, setCanReview] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const amountInputRef = useRef();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/product/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);

        if (data.category) {
          const relRes = await fetch(`http://localhost:5000/product?category=${encodeURIComponent(data.category)}`);
          if (relRes.ok) {
            const relData = await relRes.json();
            // Filter out current product and limit to 6 related products
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

  // Check if user can review this product
  useEffect(() => {
    const checkReviewEligibility = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setCanReview(false);
        return;
      }

      try {
        const orders = await axios.get(`http://localhost:5000/order/${userId}`);
        const userOrders = orders.data;

        // Check if user has any delivered orders for this product
        let hasDeliveredOrder = false;
        let hasAlreadyReviewed = false;

        for (const order of userOrders) {
          if (order.orderStatus === "Delivered") {
            const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items);

            for (const item of items) {
              const itemId = item._id || item.id || item;
              const productId = id;

              if (itemId === productId) {
                hasDeliveredOrder = true;
                break;
              }
            }
          }
        }

        // Check if user has already reviewed this product
        const existingReview = product.reviews?.find(review =>
          review.user === userId || review.userName === localStorage.getItem("username")
        );

        hasAlreadyReviewed = !!existingReview;

        setCanReview(hasDeliveredOrder && !hasAlreadyReviewed);
      } catch (error) {
        console.error("Error checking review eligibility:", error);
        setCanReview(false);
      }
    };

    if (product) {
    checkReviewEligibility();
    }
  }, [id, product]);

  const handleAddToCart = () => {
    const product_item = {
      product: product,
      amount: amountInputRef.current.value || 1,
    };
    dispatch(addToCart(product_item));
    alert('Added to cart!');
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
    } else {
      setConfirmShow(true);
    }
  };

  const handleCancel = () => {
    setConfirmShow(false);
  };

  const handleConfirm = async () => {
    setConfirmShow(false);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);

    try {
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("username") || "Anonymous";

      const res = await axios.post(`http://localhost:5000/product/${id}/review`, {
        user: userId,
        userName: userName,
        rating: reviewRating,
        comment: reviewText
      });

      if (res.status === 201) {
        // Update the product with the new review
        setProduct(prev => ({
          ...prev,
          reviews: [...(prev.reviews || []), res.data.review]
        }));
        setReviewText('');
        setReviewRating(5);

        // Show success message
        alert('✅ Review submitted successfully! Thank you for your feedback.');

        // Scroll to reviews section
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

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const userId = localStorage.getItem("userId");

      const res = await axios.delete(`http://localhost:5000/product/${id}/review/${reviewId}`, {
        data: { user: userId }
      });

      if (res.status === 200) {
        // Remove the review from the product state
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

  const handleRelatedProductClick = (productId) => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/product/${productId}`);
  };

  // Calculate average rating from reviews
  const avgRating = product && product.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length)
    : product?.rating || 0;

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found.</div>;

  return (
    <>
      <NavBar />
      <Stack spacing={4} sx={{ maxWidth: 900, margin: 'auto', p: 3 }}>
        <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, p: 2 }}>
          <CardContent sx={{ flex: 1 }}>
            <img src={product.image || product.images?.[0]} alt={product.name || product.title} style={{ maxWidth: 300, borderRadius: 8, marginBottom: 16 }} />
          </CardContent>
          <CardContent sx={{ flex: 2 }}>
            <Typography variant="h4" gutterBottom>{product.name || product.title}</Typography>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Rating value={avgRating} precision={0.5} readOnly />
              <Typography variant="body1">{avgRating.toFixed(1)} / 5</Typography>
            </Stack>
            <Typography variant="h5" color="primary" fontWeight={700} mb={1}>₹ {product.price}</Typography>
            <Typography variant="body1" mb={2}>{product.description}</Typography>
            <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'} mb={2}>
              <b>Stock:</b> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <TextField
                inputRef={amountInputRef}
                type="number"
                label="Quantity"
                size="small"
                InputProps={{ inputProps: { min: 1, max: product.stock || 10 } }}
                defaultValue={1}
                sx={{ width: 100 }}
              />
              <Button variant="contained" color="primary" onClick={handleAddToCart} disabled={product.stock <= 0}>
                Add to Cart
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCheckout} disabled={product.stock <= 0}>
                Checkout
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card data-reviews-section>
          <CardContent>
            <Typography variant="h5" gutterBottom>Reviews</Typography>
            {product.reviews && product.reviews.length > 0 ? (
              <Stack spacing={2}>
                {product.reviews.map((r, i) => (
                  <Card key={i} variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography fontWeight={700}>{r.userName || "Anonymous"}</Typography>
                      <Rating value={r.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(r.date).toLocaleDateString()}
                        </Typography>
                      </Stack>
                      {/* Show delete button if this is the user's review */}
                      {token && (r.user === localStorage.getItem("userId") || r.userName === localStorage.getItem("username")) && (
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => handleDeleteReview(r._id)}
                          sx={{ minWidth: 'auto', px: 1 }}
                        >
                          🗑️ Delete
                        </Button>
                      )}
                    </Stack>
                    <Typography variant="body2" mt={1}>{r.comment}</Typography>
                  </Card>
                ))}
              </Stack>
            ) : <Typography color="text.secondary">No reviews yet. Be the first to review this product!</Typography>}

            {/* Review Form and Eligibility Message */}
            {token && (
              canReview ? (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom color="success.contrastText">
                    ✅ Write a Review
                  </Typography>
                  <form onSubmit={handleReviewSubmit}>
                    <Stack spacing={2} maxWidth={400}>
                      <TextField
                        label="Your Review"
                        multiline
                        rows={3}
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        required
                        placeholder="Share your experience with this product..."
                      />
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography>Rating:</Typography>
                        <Rating
                          value={reviewRating}
                          onChange={(_, val) => setReviewRating(val)}
                          max={5}
                        />
                      </Stack>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={reviewLoading || !reviewText.trim()}
                        sx={{ alignSelf: 'flex-start' }}
                      >
                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </Stack>
                  </form>
                </Box>
              ) : (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
                  <Typography variant="body2" color="warning.contrastText">
                    To write a review, you should have bought this product.
                  </Typography>
                </Box>
              )
            )}
            {/* End Review Form and Eligibility Message */}
          </CardContent>
        </Card>

        {/* Related Products */}
        {related.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Related Products</Typography>
              <Grid container spacing={2}>
                {related.map(prod => (
                  <Grid item xs={12} sm={6} md={4} key={prod._id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        height: '100%',
                        borderRadius: 2,
                        boxShadow: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-4px)',
                          '& .product-image': {
                            transform: 'scale(1.05)'
                          }
                        }
                      }}
                      onClick={() => handleRelatedProductClick(prod._id)}
                    >
                      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{
                          height: 150,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1,
                          overflow: 'hidden',
                          borderRadius: 1
                        }}>
                          <img
                            src={prod.image || prod.images?.[0]}
                            alt={prod.name || prod.title}
                            className="product-image"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain',
                              transition: 'transform 0.3s ease'
                            }}
                          />
                        </Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.2
                          }}
                        >
                          {prod.name || prod.title}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight={700}
                          sx={{ mb: 0.5 }}
                        >
                          ₹ {prod.price}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 'auto' }}>
                          <Rating
                            value={prod.rating}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{
                              "& .MuiRating-iconFilled": {
                                color: "#f39c12",
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({prod.rating})
                          </Typography>
                        </Stack>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}
      </Stack>

      {/* Confirmation Dialog */}
      <Dialog open={confirmShow} onClose={handleCancel}>
        <DialogTitle>Go to Cart</DialogTitle>
        <DialogContent>
          <Typography>
            Would you like to go to your cart to complete the checkout process?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            Go to Cart
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </>
  );
};

export default ProductPage;