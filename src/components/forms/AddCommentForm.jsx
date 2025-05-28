import { useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  useTheme,
  Paper,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AddCommentForm = ({ postId, parentCommentId = null, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const theme = useTheme();

  const axiosPrivate = useAxiosPrivate();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("Treść komentarza nie może być pusta");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("postId", postId);
      if (parentCommentId !== null) {
        formData.append("parentCommentId", parentCommentId);
      }
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axiosPrivate.post(
        `/posts/${postId}/comments`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      setContent("");
      setFiles([]);
      if (onCommentAdded) onCommentAdded(response.data.comment);
    } catch (err) {
      console.error(err);
      setError("Błąd podczas dodawania komentarza");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        background: theme.palette.background.default,
        border: `1.5px solid ${theme.palette.primary.main}`,
        boxShadow: '0 2px 12px 0 rgba(42,63,84,0.07)',
      }}
    >
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
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Napisz komentarz..."
          disabled={isSubmitting}
          variant="outlined"
          fullWidth
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

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          disabled={isSubmitting}
        />

        <Button
          variant="outlined"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          disabled={isSubmitting}
          sx={{
            alignSelf: "flex-start",
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            fontWeight: 600,
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
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.primary.main }}>
              Wybrane pliki:
            </Typography>
            <List dense>
              {files.map((file, index) => (
                <ListItem key={index} sx={{ py: 0, my: 0 }}>
                  {file.type.startsWith("image/") && (
                    <Box
                      component="img"
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      sx={{
                        width: 50,
                        height: "auto",
                        mr: 1,
                        borderRadius: 1,
                        border: `2px solid ${theme.palette.primary.light}`,
                        background: theme.palette.background.default,
                      }}
                    />
                  )}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.primary,
                      wordBreak: "break-all" 
                    }}
                  >
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "#fff",
            fontWeight: 600,
            "&:hover": {
              bgcolor: theme.palette.secondary.main,
              color: "#fff",
            },
          }}
        >
          {isSubmitting ? "Dodawanie..." : "Dodaj komentarz"}
        </Button>
      </Box>
    </Paper>
  );
};

export default AddCommentForm;