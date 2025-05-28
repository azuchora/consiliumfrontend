import { Link } from "react-router-dom";
import { Box, Paper, Typography, Button, useTheme } from "@mui/material";

const SuccessMessage = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          background: theme.palette.background.default,
          border: `1.5px solid ${theme.palette.primary.main}`,
          boxShadow: '0 2px 12px 0 rgba(42,63,84,0.07)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: theme.palette.success.main,
            textAlign: 'center',
          }}
        >
          Sukces!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: theme.palette.text.primary,
            textAlign: 'center',
          }}
        >
          Twoje konto zostało utworzone pomyślnie.
        </Typography>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "#fff",
            fontWeight: 700,
            borderRadius: 2,
            py: 1.2,
            fontSize: "1rem",
            "&:hover": {
              bgcolor: theme.palette.secondary.main,
              color: "#fff",
            },
          }}
          fullWidth
        >
          Zaloguj się
        </Button>
      </Paper>
    </Box>
  );
};

export default SuccessMessage;