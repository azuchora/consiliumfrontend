import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import ErrorMessage from '../RegisterForm/ErrorMessage';
import axios from '../../api/axios';
import './LoginForm.css';

const LoginForm = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
      </form>
      <p className='login-form-signup'>
        Potrzebujesz konta?<br/>
        <a href='#'>Zarejestruj się</a>
      </p>
    </section>
  )
}

export default LoginForm;
