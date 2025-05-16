import { useRef, useState, useEffect } from 'react';
import ErrorMessage from '../messages/ErrorMessage';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import { ROLES } from '../../constants/roles';
import './LoginForm.css';

const LoginForm = () => {
  const { setAuth, persist, setPersist, auth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (auth?.accessToken) {
      if(auth?.roles.includes(ROLES.Verified)){
        console.log(auth);
        navigate('/home', { replace: true});
      } else {
        navigate('/verify', { replace: true });
      }
    }
  }, [auth?.accessToken]);

  useEffect(() => {
    userRef.current.focus();
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
      console.log(response?.data);
      const accessToken = response?.data?.accessToken;
      const uid = response?.data?.id;
      const avatarFilename = response?.data?.avatarFilename;
      const roles = response?.data?.roles;
      setAuth({ user, uid, avatarFilename, roles, accessToken });
      setUser('');
      setPassword('')
      navigate(from, { replace: true }); 
    } catch (err){
      if(!err?.response){
        setErrorMessage('Nie można połączyć się z serwerem.');
      } else if (err.response?.status === 400){
        setErrorMessage('Brak nazwy użytkownika lub hasła.');
      } else if (err.response?.status === 401){
        setErrorMessage('Niepoprawna nazwa użytkownika lub hasło.');
      } else {
        setErrorMessage('Błąd logowania.');
      }
      errRef.current.focus();
    }
  }

  const togglePersist = () => {
    setPersist(prev => !prev);
  }

  useEffect(() => {
    localStorage.setItem('persist', persist);
  }, [persist]);

  return (
    <section className='login-form-container'>
      <ErrorMessage message={errorMessage} errRef={errRef}/>
      <h1 className='login-form-title'>Logowanie</h1>
      <form className='login-form' onSubmit={handleSubmit}>
        <label htmlFor='username' className='login-form-label'>Nazwa użytkownika:</label>
        <input
          className='login-form-input' 
          type='text'
          id='username'
          ref={userRef}
          autoComplete='off'
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required 
        />

        <label htmlFor='password' className='login-form-label'>Hasło:</label>
        <input
          className='login-form-input' 
          type='password'
          id='password'
          autoComplete='current-password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required 
        />

        <button className='login-form-btn'>Zaloguj się</button>
        <section className='login-form-persist-check'>
          <input 
            type='checkbox'
            id='persist'
            onChange={togglePersist}
            checked={persist}
          />
          <label htmlFor='persist'>Zaufaj temu urządzeniu</label>
        </section>
      </form>
      <Link to='/recover' className='login-form-link'>Nie pamiętasz hasła?</Link>
      <hr />
      <p className='login-form-signup'>
        Nie masz konta?<br/>
        <Link to='/register' className='login-form-link'>Zarejestruj się</Link>
      </p>
    </section>
  )
}

export default LoginForm;
