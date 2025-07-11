import { useState, useRef, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { LENGTH_LIMITS, PASSWORD_REGEX_STR } from "../constants/validation";

const PASSWORD_REGEX = new RegExp(PASSWORD_REGEX_STR);

const SetPasswordPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { token } = useParams();

  const newPasswordRef = useRef();
  const repeatPasswordRef = useRef();

  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [validPassword, setValidPassword] = useState(false);
  const [validMatch, setValidMatch] = useState(false);

  const [newPasswordFocus, setNewPasswordFocus] = useState(false);
  const [repeatPasswordFocus, setRepeatPasswordFocus] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(newPassword));
    setValidMatch(newPassword === repeatPassword && newPassword.length > 0);
  }, [newPassword, repeatPassword]);

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [newPassword, repeatPassword]);

  const canSubmit =
    newPassword &&
    repeatPassword &&
    validPassword &&
    validMatch &&
    !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !repeatPassword) {
      setError("Wszystkie pola są wymagane.");
      return;
    }
    if (!validPassword) {
      setError("Nowe hasło nie spełnia wymagań.");
      return;
    }
    if (!validMatch) {
      setError("Hasła muszą być takie same.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/users/reset-password", {
        token,
        newPassword,
      });
      setSuccess("Hasło zostało ustawione. Możesz się teraz zalogować. Za chwilę nastąpi przekierowanie do logowania.");
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Błąd podczas resetowania hasła. Link mógł wygasnąć."
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
          Ustaw nowe hasło
        </Typography>
        {success ? (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {success}
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
            label="Nowe hasło"
            type="password"
            inputRef={newPasswordRef}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onFocus={() => setNewPasswordFocus(true)}
            onBlur={() => setNewPasswordFocus(false)}
            error={!!newPassword && !validPassword}
            helperText={
              newPasswordFocus && !validPassword
                ? `Od ${LENGTH_LIMITS.PASSWORD_MIN} do ${LENGTH_LIMITS.PASSWORD_MAX} znaków. Musi zawierać dużą i małą literę, cyfrę i znak specjalny (!@#$%).`
                : " "
            }
            required
            fullWidth
            variant="outlined"
            autoComplete="new-password"
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
          <TextField
            label="Powtórz nowe hasło"
            type="password"
            inputRef={repeatPasswordRef}
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            onFocus={() => setRepeatPasswordFocus(true)}
            onBlur={() => setRepeatPasswordFocus(false)}
            error={!!repeatPassword && (!validMatch || !validPassword)}
            helperText={
              repeatPasswordFocus && repeatPassword
                ? !validMatch
                  ? "Hasła muszą być identyczne."
                  : !validPassword
                  ? "Hasło nie spełnia wymagań."
                  : " "
                : " "
            }
            required
            fullWidth
            variant="outlined"
            autoComplete="new-password"
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
            disabled={!canSubmit}
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
            {loading ? <CircularProgress size={24} /> : "Ustaw nowe hasło"}
          </Button>
        </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SetPasswordPage;