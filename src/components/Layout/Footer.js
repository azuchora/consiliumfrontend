import { Box, Typography, Link, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        py: 3,
        bgcolor: theme.palette.primary.dark,
        color: '#fff',
        textAlign: 'center',
        mt: 'auto',
        maxWidth: '100vw',
      }}
    >
      <Typography variant="body2" sx={{ mb: 1, px: 1 }}>
        &copy; 2025 CONSILIUM. Wszelkie prawa zastrzeżone.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 2,
          px: 1,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Link
          href="/privacy"
          underline="hover"
          sx={{
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          Polityka prywatności
        </Link>
        <Link
          href="/terms"
          underline="hover"
          sx={{
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          Regulamin
        </Link>
        <Link
          href="/contact"
          underline="hover"
          sx={{
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          Kontakt
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;