import { useState, useRef, useEffect } from 'react';
import { PESEL_REGEX, NAME_REGEX, SURNAME_REGEX, PWZ_REGEX } from '../../constants/validation';
import ErrorMessage from '../messages/ErrorMessage';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, TextField, Divider, useTheme } from '@mui/material';
import useLogout from '../../hooks/useLogout';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useRefreshToken from '../../hooks/useRefreshToken';

const VerifyForm = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const axiosPrivate = useAxiosPrivate();
  const refresh = useRefreshToken();
  const theme = useTheme();

  const signOut = async () => {
    await logout();
    navigate('/login');
  };

  const nameRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState('');
  const [validName, setValidName] = useState(false);

  const [surname, setSurname] = useState('');
  const [validSurname, setValidSurname] = useState(false);

  const [pesel, setPesel] = useState('');
  const [validPesel, setValidPesel] = useState(false);

  const [pwz, setPwz] = useState('');
  const [validPwz, setValidPwz] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidName(NAME_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidSurname(SURNAME_REGEX.test(surname));
  }, [surname]);

  useEffect(() => {
    setValidPesel(PESEL_REGEX.test(pesel));
  }, [pesel]);

  useEffect(() => {
    setValidPwz(PWZ_REGEX.test(pwz));
  }, [pwz]);

  useEffect(() => {
    setErrorMessage('');
  }, [name, surname, pesel, pwz]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = NAME_REGEX.test(name);
    const v2 = PESEL_REGEX.test(pesel);
    const v3 = SURNAME_REGEX.test(surname);
    const v4 = PWZ_REGEX.test(pwz);
    if (!v1 || !v2 || !v3 || !v4) {
      setErrorMessage('Nieprawidłowe dane.');
      return;
    }

    try {
      await axiosPrivate.post('/verify', {
        name,
        surname,
        pesel,
        pwz
      });

      await refresh();
      navigate('/posts');
    } catch (err) {
      if (!err?.response) {
        setErrorMessage('Nie można połączyć się z serwerem.');
      } else if (err.response?.status === 404) {
        setErrorMessage('Nie można zweryfikować użytkownika.');
      } else {
        setErrorMessage('Błąd weryfikacji użytkownika.');
      }
      errRef.current?.focus();
    }
  };

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
          Weryfikacja
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
            label="Imię"
            id="name"
            inputRef={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={name && !validName}
            helperText={name && !validName ? 'Wprowadź poprawne imię.' : ' '}
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
            label="Nazwisko"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            error={surname && !validSurname}
            helperText={surname && !validSurname ? 'Wprowadź poprawne nazwisko.' : ' '}
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
            label="Numer PESEL"
            id="pesel"
            value={pesel}
            onChange={(e) => setPesel(e.target.value)}
            error={pesel && !validPesel}
            helperText={pesel && !validPesel ? 'Wprowadź 11-cyfrowy numer PESEL.' : ' '}
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
            label="Numer PWZ"
            id="pwz"
            value={pwz}
            onChange={(e) => setPwz(e.target.value)}
            error={pwz && !validPwz}
            helperText={pwz && !validPwz ? 'Wprowadź 7-cyfrowy numer PWZ.' : ' '}
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

          <Button
            type="submit"
            variant="contained"
            disabled={!validName || !validSurname || !validPesel || !validPwz}
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
            fullWidth
          >
            Zweryfikuj
          </Button>
        </Box>
        <Divider sx={{ width: '100%', my: 2, borderColor: theme.palette.primary.light, opacity: 0.5 }} />
        <Link
          onClick={signOut}
          style={{
            color: theme.palette.primary.main,
            fontWeight: 600,
            textAlign: 'center',
            cursor: 'pointer',
            marginTop: 8,
          }}
        >
          Wyloguj się
        </Link>
      </Paper>
    </Box>
  );
};

export default VerifyForm;
