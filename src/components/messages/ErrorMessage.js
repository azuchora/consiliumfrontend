import { Alert, Collapse } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ErrorMessage = ({ message, errRef }) => {
  const theme = useTheme();

  return (
    <Collapse in={!!message} sx={{ width: '100%', mb: message ? 2 : 0 }}>
      {message && (
        <Alert
          ref={errRef}
          severity="error"
          variant="filled"
          sx={{
            bgcolor: theme.palette.error.main,
            color: "#fff",
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: '0 2px 8px 0 rgba(42,63,84,0.07)',
            fontSize: "1rem",
          }}
          aria-live="assertive"
        >
          {message}
        </Alert>
      )}
    </Collapse>
  );
};

export default ErrorMessage;