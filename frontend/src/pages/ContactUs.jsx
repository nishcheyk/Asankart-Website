import { useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import { Box } from "@mui/material";
import { Mail, Close as CloseIcon } from "@mui/icons-material";
import emailjs from "@emailjs/browser";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import {
  isNotEmpty,
  validateEmail,
  numberCheck,
  messageHasLength,
} from "../util/auth.jsx";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const ContactForm = () => {
  const [form, setForm] = useState({
    fname: "",
    email: "",
    telephone: "",
    city: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState({ text: null, type: null });

  const validate = () => {
    let temp = {};
    temp.fname = isNotEmpty(form.fname) ? "" : "Name is required";
    temp.email = validateEmail(form.email) ? "" : "Invalid email format";
    temp.telephone = numberCheck(form.telephone) ? "" : "Invalid mobile number";
    temp.city = isNotEmpty(form.city) ? "" : "City is required";
    temp.message = messageHasLength(form.message)
      ? ""
      : "Message is too short";

    setErrors({ ...temp });
    return Object.values(temp).every((val) => val === "");
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Replace `process.env` with your actual environment variables
      await emailjs.sendForm(
        "service_6pgjuim",
        "template_891acup",
        e.target,
        "G33VZQYr4J-lncbGx"// Ensure these are accessed as process.env.VARIABLE
      );

      setStateMessage({ text: "✅ Message sent successfully!", type: "success" });
      setForm({ fname: "", email: "", telephone: "", city: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStateMessage({
        text: "❌ Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />
      <Box sx={{ backgroundColor: "#fff", minHeight: "100vh", py: 8 }}>
        <Container maxWidth="md">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.div variants={fadeInUp}>
              <Avatar sx={{ m: "auto", bgcolor: "primary.main" }}>
                <Mail />
              </Avatar>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Typography variant="h5" mt={2} gutterBottom>
                Get in Touch
              </Typography>
              <Typography variant="body1" color="textSecondary">
                We’d love to hear from you. Fill out the form and we’ll be in touch soon.
              </Typography>
            </motion.div>
          </motion.div>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fname"
                  value={form.fname}
                  onChange={handleOnChange}
                  error={!!errors.fname}
                  helperText={errors.fname}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleOnChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleOnChange}
                  error={!!errors.telephone}
                  helperText={errors.telephone}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleOnChange}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Message"
                  name="message"
                  value={form.message}
                  onChange={handleOnChange}
                  error={!!errors.message}
                  helperText={errors.message}
                />
              </Grid>
              <Grid item xs={12}>
                <Collapse in={!!stateMessage.type}>
                  <Alert
                    severity={stateMessage.type || "info"}
                    action={
                      <IconButton
                        aria-label="close"
                        size="small"
                        onClick={() => setStateMessage({ text: null, type: null })}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mb: 2 }}
                  >
                    {stateMessage.text}
                  </Alert>
                </Collapse>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
                  }
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ContactForm;
