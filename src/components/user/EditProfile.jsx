import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  Avatar,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { BACKEND_URL } from "../../api/axios";

const EditProfile = ({ user, onClose, onUpdated }) => {
  const theme = useTheme();
  const axiosPrivate = useAxiosPrivate();
  const { setAvatar } = useAuth();

  const [form, setForm] = useState({
    name: user.name || "",
    surname: user.surname || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user.files && user.files.length > 0
      ? `${BACKEND_URL || ""}/static/${user.files[0].filename}`
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // await axiosPrivate.patch(`/users/${user.id}`, {
      //   name: form.name,
      //   surname: form.surname,
      // });

      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const res = await axiosPrivate.put(`/users/${user.id}/avatar`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data && res.data.filename) {
          setAvatar(res.data.filename);
        }
      }

      setSuccess("Profil zaktualizowany!");
      if (onUpdated) onUpdated();
    } catch (err) {
      setError("Błąd podczas aktualizacji profilu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        background: "#fff",
        border: `1.5px solid ${theme.palette.primary.light}`,
        boxShadow: "0 2px 8px 0 rgba(42,63,84,0.07)",
        maxWidth: 400,
        width: "100%",
        overflowX: "hidden",
        mx: "auto",
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Typography variant="h6" fontWeight={700} color={theme.palette.primary.main}>
          Edytuj profil
        </Typography>
        <label htmlFor="avatar-upload">
          <input
            accept="image/*"
            id="avatar-upload"
            type="file"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
          <Avatar
            src={avatarPreview}
            sx={{
              width: 90,
              height: 90,
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              fontWeight: 700,
              fontSize: 36,
              border: `3px solid ${theme.palette.secondary.main}`,
              cursor: "pointer",
              mb: 1,
            }}
          >
            {!avatarPreview && user.username?.[0]?.toUpperCase()}
          </Avatar>
          <Typography
            variant="body2"
            color={theme.palette.primary.main}
            sx={{ cursor: "pointer", textAlign: "center" }}
          >
            Zmień avatar
          </Typography>
        </label>
        <TextField
          name="name"
          label="Imię"
          value={form.name}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          name="surname"
          label="Nazwisko"
          value={form.surname}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 1, width: "100%", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              px: 4,
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.secondary.main,
              },
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Zapisz"}
          </Button>
          {onClose && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              sx={{
                borderRadius: 2,
                fontWeight: 600,
                px: 4,
                color: theme.palette.secondary.main,
                borderColor: theme.palette.secondary.main,
                "&:hover": {
                  bgcolor: theme.palette.secondary.light,
                },
              }}
              disabled={loading}
            >
              Anuluj
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default EditProfile;