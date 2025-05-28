import { Box, CircularProgress, useTheme } from "@mui/material";

const Loader = ({ fullscreen = false }) => {
  const theme = useTheme();

  if (fullscreen) {
    return (
      <Box
        sx={{
          position: "fixed",
          zIndex: 1300,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress
          size={80}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            boxShadow: "0 0 14px 2px rgba(42,63,84,0.13)",
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
        width: "100%",
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: theme.palette.primary.main,
          boxShadow: "0 0 14px 2px rgba(42,63,84,0.13)",
        }}
      />
    </Box>
  );
};

export default Loader;