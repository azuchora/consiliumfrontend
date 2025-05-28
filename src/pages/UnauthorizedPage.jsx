import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const goBack = () => navigate(-1);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          maxWidth: 440,
          width: "100%",
          boxShadow: '0 2px 12px 0 rgba(42,63,84,0.07)',
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: `1.5px solid ${theme.palette.primary.main}`,
          background: theme.palette.background.paper,
        }}
      >
        <FontAwesomeIcon
          icon={faBan}
          style={{
            fontSize: "3rem",
            color: theme.palette.error.main,
            marginBottom: "1rem",
          }}
        />
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 700,
            mb: 2,
            textAlign: "center",
          }}
        >
          Brak uprawnień
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.primary,
            mb: 3,
            textAlign: "center",
          }}
        >
          Nie masz uprawnień do wyświetlenia tej strony. Skontaktuj się z administratorem, jeśli uważasz, że to błąd.
        </Typography>
        <Button
          variant="contained"
          onClick={goBack}
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
          Powrót
        </Button>
      </Paper>
    </Box>
  );
};

export default UnauthorizedPage;