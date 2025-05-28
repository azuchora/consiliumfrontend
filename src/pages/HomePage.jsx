import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faFolderOpen, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';

const features = [
  {
    icon: faComments,
    title: 'Dyskusje specjalistyczne',
    text: 'Dołącz do konwersacji z lekarzami z różnych dziedzin i konsultuj trudne przypadki.'
  },
  {
    icon: faFolderOpen,
    title: 'Archiwum przypadków',
    text: 'Przeglądaj zarchiwizowane przypadki i ucz się na podstawie doświadczeń innych.'
  },
  {
    icon: faShieldAlt,
    title: 'Automatyczna cenzura danych wrażliwych',
    text: 'Automatyczna cenzura danych wrażliwych na zdjęciach i plikach tekstowych.'
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.primary.light,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: { xs: 2, sm: 4 },
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          background: theme.palette.background.paper,
          borderRadius: 4,
          boxShadow: theme.shadows[4],
          py: { xs: 2, sm: 4 },
          px: { xs: 0.5, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            mb: 4,
            borderRadius: 3,
            background: theme.palette.primary.dark,
            color: '#fff',
            textAlign: 'center',
            width: '100%',
            boxShadow: theme.shadows[6],
            overflowX: 'hidden',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              letterSpacing: 2,
              fontSize: { xs: '2rem', sm: '2.5rem' },
              mb: 1,
              color: '#fff',
              width: '100%',
              overflowWrap: 'break-word',
            }}
          >
            CONSILIUM
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
              color: 'rgba(255,255,255,0.85)',
              width: '100%',
              overflowWrap: 'break-word',
            }}
          >
            Forum dyskusyjne dla lekarzy
          </Typography>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 4 },
            mb: 4,
            borderRadius: 3,
            textAlign: 'center',
            background: theme.palette.background.default,
            width: '100%',
            boxShadow: theme.shadows[2],
            overflowX: 'hidden',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 2,
              fontSize: { xs: '1.3rem', sm: '2rem' },
              width: '100%',
              overflowWrap: 'break-word',
            }}
          >
            Witamy w CONSILIUM
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.15rem' },
              color: theme.palette.text.secondary,
              mb: 3,
              width: '100%',
              overflowWrap: 'break-word',
            }}
          >
            Wymieniaj się wiedzą, pytaj, konsultuj przypadki, ucz się razem z innymi specjalistami.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size={isMobile ? 'medium' : 'large'}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              borderRadius: 2,
              boxShadow: theme.shadows[2],
              transition: 'transform 0.15s, box-shadow 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: theme.shadows[6],
              },
            }}
            onClick={() => navigate('/posts')}
          >
            Przejdź do forum
          </Button>
        </Paper>

        <Grid
          container
          spacing={3}
          sx={{
            mb: 4,
            width: '100%',
            justifyContent: 'center',
            overflowX: 'hidden',
            margin: 0,
          }}
          columns={{ xs: 1, md: 2 }}
        >
          {features.map((feature, idx) => (
            <Grid
              key={feature.title}
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: { xs: '100%', md: 380 },
                width: '100%',
                px: { xs: 0, sm: 1 },
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: '100%',
                  maxWidth: { xs: '100%', md: 380 },
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: theme.palette.background.default,
                  boxShadow: theme.shadows[1],
                  minHeight: 220,
                  justifyContent: 'center',
                  mx: 'auto',
                  overflowX: 'hidden',
                }}
              >
                <FontAwesomeIcon
                  icon={feature.icon}
                  style={{
                    color: theme.palette.primary.main,
                    fontSize: '2.2rem',
                    marginBottom: '0.9rem',
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    mb: 1,
                    textAlign: 'center',
                    width: '100%',
                    overflowWrap: 'break-word',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    textAlign: 'center',
                    width: '100%',
                    overflowWrap: 'break-word',
                  }}
                >
                  {feature.text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;