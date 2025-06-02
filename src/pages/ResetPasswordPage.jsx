import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "../api/axios";

const ResetPasswordPage = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("/users/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Błąd podczas wysyłania maila. Spróbuj ponownie."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        mt: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          background: theme.palette.background.default,
          border: `1.5px solid ${theme.palette.primary.main}`,
          boxShadow: "0 2px 12px 0 rgba(42,63,84,0.07)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: theme.palette.primary.main,
            textAlign: "center",
          }}
        >
          Resetuj hasło
        </Typography>
        {sent ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Link do resetowania hasła został wysłany na podany adres e-mail.
          </Alert>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <TextField
              label="Adres e-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
              autoComplete="email"
              sx={{
                bgcolor: "#fff",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.palette.secondary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.secondary.main,
                  },
                },
              }}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                py: 1.2,
                fontSize: "1rem",
                mt: 1,
                bgcolor: theme.palette.primary.main,
                "&:hover": {
                  bgcolor: theme.palette.secondary.main,
                },
              }}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Wyślij link resetujący"}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ResetPasswordPage;