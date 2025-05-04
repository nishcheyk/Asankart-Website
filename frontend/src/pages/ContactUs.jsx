import { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Mail } from "@mui/icons-material";
import emailjs from "@emailjs/browser";
import NavBar from "../components/NavBar.jsx";
import {
  isNotEmpty,
  validateEmail,
  numberCheck,
  messageHasLength,
} from "../util/auth.jsx";

const theme = createTheme();

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
  const [stateMessage, setStateMessage] = useState(null);

  // 🔍 Form Validation
  const validate = () => {
    let temp = {};
    temp.fname = isNotEmpty(form.fname) ? "" : "Name is required";
    temp.email = validateEmail(form.email) ? "" : "Invalid email format";
    temp.telephone = numberCheck(form.telephone)
      ? ""
      : "Invalid mobile number";
    temp.city = isNotEmpty(form.city) ? "" : "City is required";
    temp.message = messageHasLength(form.message)
      ? ""
      : "Message is required or too short";

    setErrors({ ...temp });
    return Object.values(temp).every((val) => val === "");
  };

  // 🔄 Handle Field Changes
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await emailjs.sendForm(
        process.env.REACT_APP_SERVICE_ID,
        process.env.REACT_APP_TEMPLATE_ID,
        e.target,
        process.env.REACT_APP_PUBLIC_KEY
      );

      console.log("Email sent:", result);
      setStateMessage("Message sent successfully!");
      setForm({
        fname: "",
        email: "",
        telephone: "",
        city: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStateMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStateMessage(null), 5000);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <Mail />
          </Avatar>
          <Typography component="h1" variant="h5">
            Contact Form
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={!!errors.fname}
                  helperText={errors.fname}
                  name="fname"
                  required
                  fullWidth
                  label="Full Name"
                  value={form.fname}
                  onChange={handleOnChange}
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={!!errors.email}
                  helperText={errors.email}
                  name="email"
                  required
                  fullWidth
                  label="Email Address"
                  value={form.email}
                  onChange={handleOnChange}
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!!errors.telephone}
                  helperText={errors.telephone}
                  name="telephone"
                  required
                  fullWidth
                  label="Mobile Number"
                  value={form.telephone}
                  onChange={handleOnChange}
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!!errors.city}
                  helperText={errors.city}
                  name="city"
                  required
                  fullWidth
                  label="City"
                  value={form.city}
                  onChange={handleOnChange}
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={!!errors.message}
                  helperText={errors.message}
                  name="message"
                  required
                  fullWidth
                  multiline
                  rows={6}
                  label="Message"
                  value={form.message}
                  onChange={handleOnChange}
                  disabled={isSubmitting}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: 45 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Submit"}
            </Button>

            {stateMessage && (
              <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
                {stateMessage}
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ContactForm;
