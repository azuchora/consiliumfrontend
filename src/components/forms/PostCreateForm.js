import { useState, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Typography,
  useTheme,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const PostCreateForm = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    postStatusId: "1",
    age: "",
    gender: "male",
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const axiosPrivate = useAxiosPrivate();
  const theme = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { title, description, postStatusId, age, gender } = formData;
    if (!title.trim() || !description.trim()) {
      setError("Tytuł i opis są wymagane");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", title);
      data.append("description", description);
      data.append("postStatusId", postStatusId);
      data.append("age", age);
      data.append("gender", gender);

      files.forEach((file) => data.append("files", file));

      const response = await axiosPrivate.post("/posts", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (fileInputRef.current) fileInputRef.current.value = null;

      setFormData({
        title: "",
        description: "",
        postStatusId: "1",
        age: "",
        gender: "male",
      });
      setFiles([]);
      if (onPostCreated) onPostCreated(response.data.post);
    } catch (err) {
      console.error(err);
      setError("Błąd podczas dodawania posta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        p: { xs: 2, sm: 4 },
        borderRadius: 3,
        background: "#fff",
        mb: 3,
        boxShadow: "0 4px 24px 0 rgba(60, 72, 88, 0.10), 0 1.5px 4px 0 rgba(60, 72, 88, 0.08)",
        maxWidth: 600,
        width: "100%",
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        label="Tytuł posta"
        name="title"
        value={formData.title}
        onChange={handleChange}
        disabled={isSubmitting}
        fullWidth
        required
        variant="outlined"
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
        label="Opis posta"
        name="description"
        value={formData.description}
        onChange={handleChange}
        disabled={isSubmitting}
        fullWidth
        required
        multiline
        minRows={4}
        variant="outlined"
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

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl fullWidth>
          <InputLabel id="post-status-label">Status</InputLabel>
          <Select
            labelId="post-status-label"
            name="postStatusId"
            value={formData.postStatusId}
            label="Status"
            onChange={handleChange}
            disabled={isSubmitting}
            MenuProps={{ disableScrollLock: true }}
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
          >
            <MenuItem value="1">Zwykły</MenuItem>
            <MenuItem value="2">Pilne</MenuItem>
            <MenuItem value="3">Informacyjny</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Wiek"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          disabled={isSubmitting}
          fullWidth
          inputProps={{ min: 0 }}
          variant="outlined"
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

        <FormControl fullWidth>
          <InputLabel id="gender-label">Płeć</InputLabel>
          <Select
            labelId="gender-label"
            name="gender"
            value={formData.gender}
            label="Płeć"
            onChange={handleChange}
            disabled={isSubmitting}
            MenuProps={{ disableScrollLock: true }}
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
          >
            <MenuItem value="male">Mężczyzna</MenuItem>
            <MenuItem value="female">Kobieta</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isSubmitting}
        style={{ display: "none" }}
      />

      <Button
        variant="outlined"
        startIcon={<AddPhotoAlternateIcon />}
        onClick={() => fileInputRef.current?.click()}
        disabled={isSubmitting}
        sx={{
          alignSelf: "flex-start",
          color: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          fontWeight: 600,
          borderRadius: 2,
          "&:hover": {
            bgcolor: theme.palette.secondary.main,
            color: "#fff",
            borderColor: theme.palette.secondary.main,
          },
        }}
      >
        Wybierz pliki
      </Button>

      {files.length > 0 && (
        <Box
          sx={{
            fontSize: "0.95rem",
            color: "#333",
            background: "#f6f8fa",
            borderRadius: 2,
            p: "0.75rem 1rem",
            mb: 1,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.primary.main }}>
            Wybrane pliki:
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", pl: 0, m: 0 }}>
            {files.map((file, index) => (
              <Box
                component="li"
                key={index}
                sx={{
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {file.type.startsWith("image/") && (
                  <Box
                    component="img"
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    sx={{
                      height: 44,
                      width: 44,
                      mr: 1.5,
                      borderRadius: 2,
                      objectFit: "cover",
                      border: "1.5px solid #e0e0e0",
                      boxShadow: "0 2px 8px rgba(60, 72, 88, 0.07)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "scale(1.08)",
                        boxShadow: "0 4px 16px rgba(60, 72, 88, 0.15)",
                      },
                    }}
                  />
                )}
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            mb: 1,
            fontSize: "1rem",
          }}
        >
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        color="success"
        disabled={isSubmitting}
        sx={{
          fontWeight: 700,
          borderRadius: 2,
          py: 1.2,
          fontSize: "1rem",
          bgcolor: theme.palette.primary.main,
          color: "#fff",
          "&:hover": {
            bgcolor: theme.palette.secondary.main,
            color: "#fff",
          },
        }}
      >
        {isSubmitting ? "Dodawanie..." : "Dodaj post"}
      </Button>
    </Box>
  );
};

export default PostCreateForm;