import { useRef, useState, useEffect } from 'react';
import ErrorMessage from '../messages/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import { ROLES } from '../../constants/roles';
import { Box, Paper, Typography, Button, TextField, Checkbox, FormControlLabel, Divider, useTheme } from '@mui/material';

const LoginForm = () => {
  const { setAuth, persist, setPersist, auth, setAvatar, setUsername } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/posts';

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const theme = useTheme();

  useEffect(() => {
    if (auth?.accessToken) {
      if (auth?.roles.includes(ROLES.Verified)) {
        navigate('/posts', { replace: true });
      } else {
        navigate('/verify', { replace: true });
      }
    }
  }, [auth?.accessToken, auth?.roles, navigate]);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMessage('');
  }, [user, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        '/login',
        JSON.stringify({ username: user, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const accessToken = response?.data?.accessToken;
      const uid = response?.data?.id;
      const avatarFilename = response?.data?.avatarFilename;
      const roles = response?.data?.roles;
      setAuth({ user, uid, avatarFilename, roles, accessToken });
      setAvatar(avatarFilename);
      setUsername(user);
      setUser('');
      setPassword('');
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrorMessage('Nie można połączyć się z serwerem.');
      } else if (err.response?.status === 400) {
        setErrorMessage('Brak nazwy użytkownika lub hasła.');
      } else if (err.response?.status === 401) {
        setErrorMessage('Niepoprawna nazwa użytkownika lub hasło.');
      } else {
        setErrorMessage('Błąd logowania.');
      }
      errRef.current?.focus();
    }
  };

  const togglePersist = () => {
    setPersist(prev => !prev);
  };

  useEffect(() => {
    localStorage.setItem('persist', persist);
  }, [persist]);

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
          Logowanie
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
            autoComplete="username"
            required
            fullWidth
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
            autoComplete="current-password"
            required
            fullWidth
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
            Zaloguj się
          </Button>

          <FormControlLabel
            control={
              <Checkbox
                checked={persist}
                onChange={togglePersist}
                sx={{
                  color: theme.palette.primary.main,
                  '&.Mui-checked': {
                    color: theme.palette.secondary.main,
                  },
                }}
              />
            }
            label="Zaufaj temu urządzeniu"
            sx={{ mt: 1, color: theme.palette.text.primary }}
          />
        </Box>
        <Link to='/recover' style={{ color: theme.palette.primary.main, fontWeight: 600, marginTop: 12, marginBottom: 8 }}>
          Nie pamiętasz hasła?
        </Link>
        <Divider sx={{ width: '100%', my: 2, borderColor: theme.palette.primary.light, opacity: 0.5 }} />
        <Typography
          variant="body2"
          sx={{ textAlign: 'center', color: theme.palette.text.secondary }}
        >
          Nie masz konta?{' '}
          <Link to='/register' style={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            Zarejestruj się
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginForm;
