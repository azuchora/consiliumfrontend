import { useState, useRef, useEffect } from 'react';
import { LENGTH_LIMITS, USER_REGEX_STR, PASSWORD_REGEX_STR } from '../../constants/validation';
import { isEmail } from 'validator';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import { Box, Paper, Typography, Button, TextField, useTheme } from '@mui/material';
import SuccessMessage from '../messages/SuccessMessage';
import ErrorMessage from '../messages/ErrorMessage';

const USER_REGEX = new RegExp(USER_REGEX_STR);
const PASSWORD_REGEX = new RegExp(PASSWORD_REGEX_STR);

const RegisterForm = () => {
  const userRef = useRef();
  const errRef = useRef();
  const theme = useTheme();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);

  const [matchPassword, setMatchPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidEmail(isEmail(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrorMessage('');
  }, [user, email, password, matchPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = USER_REGEX.test(user);
    const v2 = PASSWORD_REGEX.test(password);
    const v3 = isEmail(email);
    if (!v1 || !v2 || !v3) {
      setErrorMessage('Nieprawidłowe dane.');
      return;
    }

    try {
      await axios.post(
        '/register',
        JSON.stringify({ username: user, email, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrorMessage('Nie można połączyć się z serwerem.');
      } else if (err.response?.status === 409) {
        setErrorMessage('Nazwa uzytkownika lub email jest już w użyciu.');
      } else {
        setErrorMessage('Błąd rejestracji.');
      }
      errRef.current?.focus();
    }
  };

  return (
    <>
      {success ? (
        <SuccessMessage />
      ) : (
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            mx: 'auto',
            mt: 4,
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
            <ErrorMessage message={errorMessage} errRef={errRef} />
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: theme.palette.primary.main,
                textAlign: 'center',
              }}
            >
              Rejestracja
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
              }}
            >
              <TextField
                label="Nazwa użytkownika"
                id="username"
                inputRef={userRef}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                error={user && !validName}
                helperText={
                  user && !validName
                    ? `Od ${LENGTH_LIMITS.USERNAME_MIN} do ${LENGTH_LIMITS.USERNAME_MAX} znaków. Litery, cyfry, podkreślniki, myślniki są dozwolone.`
                    : ' '
                }
                fullWidth
                autoComplete="off"
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
                label="Adres e-mail"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={email && !validEmail}
                helperText={
                  email && !validEmail
                    ? 'Wprowadź poprawny adres e-mail (np. przykład@domena.pl).'
                    : ' '
                }
                fullWidth
                autoComplete="off"
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
                label="Hasło"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={password && !validPassword}
                helperText={
                  password && !validPassword
                    ? `Od ${LENGTH_LIMITS.PASSWORD_MIN} do ${LENGTH_LIMITS.PASSWORD_MAX} znaków. Musi zawierać dużą i małą literę, cyfrę i znak specjalny (!@#$%).`
                    : ' '
                }
                fullWidth
                autoComplete="new-password"
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
                label="Powtórz hasło"
                id="confirm-password"
                type="password"
                value={matchPassword}
                onChange={(e) => setMatchPassword(e.target.value)}
                error={matchPassword && (!validMatch || !validPassword)}
                helperText={
                  matchPassword && (!validMatch || !validPassword)
                    ? 'Musi być zgodne z pierwszym polem hasła.'
                    : ' '
                }
                fullWidth
                autoComplete="new-password"
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

              <Button
                type="submit"
                variant="contained"
                disabled={!validName || !validEmail || !validPassword || !validMatch}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: 2,
                  py: 1.2,
                  fontSize: "1rem",
                  mt: 1,
                  "&:hover": {
                    bgcolor: theme.palette.secondary.main,
                    color: "#fff",
                  },
                }}
              >
                Zarejestruj się
              </Button>
              <Typography
                variant="body2"
                sx={{ mt: 2, textAlign: 'center', color: theme.palette.text.secondary }}
              >
                Masz już konto?{' '}
                <Link to="/login" style={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                  Zaloguj się
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default RegisterForm;
