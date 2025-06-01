import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faFolderOpen, faShieldAlt, faUserMd, faLightbulb, faLock, faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

const features = [
  {
    icon: faComments,
    title: 'Dyskusje specjalistyczne',
    text: 'Dołącz do konwersacji z lekarzami z różnych dziedzin i konsultuj trudne przypadki. Otrzymuj szybkie odpowiedzi na nurtujące pytania kliniczne.'
  },
  {
    icon: faFolderOpen,
    title: 'Archiwum przypadków',
    text: 'Przeglądaj zarchiwizowane przypadki i ucz się na podstawie doświadczeń innych. Wyszukuj interesujące Cię tematy i rozwiązania.'
  },
  {
    icon: faShieldAlt,
    title: 'Ochrona danych',
    text: 'Automatyczna cenzura danych wrażliwych na zdjęciach i plikach tekstowych oraz pełna zgodność z RODO.'
  },
  {
    icon: faUserMd,
    title: 'Zweryfikowana społeczność',
    text: 'Dostęp mają wyłącznie zweryfikowani lekarze, co zapewnia wysoki poziom merytoryczny i bezpieczeństwo dyskusji.'
  },
  {
    icon: faLightbulb,
    title: 'Wymiana wiedzy i mentoring',
    text: 'Zadawaj pytania, dziel się doświadczeniem, pomagaj innym i korzystaj z mentoringu bardziej doświadczonych kolegów.'
  },
  {
    icon: faLock,
    title: 'Prywatność i bezpieczeństwo',
    text: 'Twoje dane są bezpieczne, a wszystkie dyskusje są chronione i dostępne tylko dla uprawnionych użytkowników. Brak reklam i komercyjnych treści.'
  },
  {
    icon: faUsers,
    title: 'Budowanie sieci kontaktów',
    text: 'Nawiązuj kontakty, współpracuj z lekarzami z całej Polski i rozwijaj swoją zawodową społeczność.'
  },
  {
    icon: faChartLine,
    title: 'Rozwój zawodowy',
    text: 'Bądź na bieżąco z nowościami, trendami i rzadkimi przypadkami klinicznymi. Zyskaj dostęp do unikalnych materiałów edukacyjnych.'
  }
];

const benefits = [
  "Dostęp do zamkniętej, zweryfikowanej społeczności lekarzy.",
  "Możliwość konsultacji trudnych przypadków i uzyskania opinii ekspertów.",
  "Bezpieczne środowisko – ochrona danych pacjentów i użytkowników.",
  "Brak reklam, komercyjnych treści i spamu.",
  "Wygodne archiwum przypadków i szybkie wyszukiwanie tematów.",
  "Możliwość rozwoju zawodowego i zdobywania nowych kontaktów.",
  "Wsparcie mentoringowe i wymiana doświadczeń między specjalistami.",
  "Nowoczesna, intuicyjna platforma dostępna na komputerze i urządzeniach mobilnych."
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
            Nasza platforma została stworzona z myślą o lekarzach, którzy chcą rozwijać swoje kompetencje, dzielić się doświadczeniem i wspólnie rozwiązywać trudne przypadki kliniczne.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
              mb: 1,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Dlaczego warto do nas dołączyć?
          </Typography>
          <List
            sx={{
              textAlign: 'left',
              margin: '12px auto 20px auto',
              maxWidth: 650,
              color: theme.palette.text.secondary,
              fontSize: '1rem',
              lineHeight: 1.7,
              width: '100%',
              pl: 0,
            }}  
          >
            {benefits.map((benefit, idx) => (
              <ListItem key={idx} sx={{ display: 'flex', alignItems: 'flex-start', py: 0.5, pl: 0 }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.3 }}>
                  <CheckIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={benefit} primaryTypographyProps={{ fontSize: '1rem' }} />
              </ListItem>
            ))}
          </List>
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

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 3,
            textAlign: 'center',
            width: '100%',
            overflowWrap: 'break-word',
          }}
        >
          Najważniejsze funkcje platformy
        </Typography>

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

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            mt: 2,
            borderRadius: 3,
            background: theme.palette.background.paper,
            width: '100%',
            textAlign: 'center',
            color: theme.palette.text.secondary,
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            boxShadow: 'none',
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, mt: 1 }}>
            Masz pytania lub chcesz zgłosić sugestię? Skontaktuj się z nami przez formularz kontaktowy lub napisz na adres <b>kontakt@consilium.pl</b>.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              mt: 1,
              borderRadius: 2,
              fontWeight: 600,
              px: 3,
              py: 1,
            }}
            onClick={() => navigate('/contact')}
          >
            Kontakt
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;