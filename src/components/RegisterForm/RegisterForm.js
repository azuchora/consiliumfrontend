import { useState, useRef, useEffect } from 'react';
import { LENGTH_LIMITS, USER_REGEX_STR, PASSWORD_REGEX_STR } from '../../constants/validation';
import { isEmail } from 'validator';
import TextInput from './TextInput';
import PasswordInput from './PasswordInput';
import SuccessMessage from '../messages/SuccessMessage';
import ErrorMessage from '../messages/ErrorMessage';
import './RegisterForm.css';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';

const USER_REGEX = new RegExp(USER_REGEX_STR);
const PASSWORD_REGEX = new RegExp(PASSWORD_REGEX_STR);

const RegisterForm = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);  

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = isEmail(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    setValidPassword(result);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrorMessage('');
  }, [user, email, password, matchPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = USER_REGEX.test(user);
    const v2 = PASSWORD_REGEX.test(password);
    const v3 = isEmail(email);
    if(!v1 || !v2 || !v3){
      setErrorMessage('Nieprawidłowe dane.')
      return;
    }

    try {
      const response = await axios.post(
        '/register', 
        JSON.stringify({ username: user, email, password}),
        {
          headers: { 'Content-Type': 'application/json'},
          withCredentials: true
        }
      );
      console.log(response.data); 
      setSuccess(true);
    } catch (err){
      if(!err?.response){
        setErrorMessage('Nie można połączyć się z serwerem.');
      } else if (err.response?.status === 409){
        setErrorMessage('Nazwa uzytkownika lub email jest już w użyciu.');
      } else {
        setErrorMessage('Błąd rejestracji.');
      }
      errRef.current.focus();
    }
  }
  
  return (
    <>
      {success ? (
        <SuccessMessage/>
      ) : (
      <section className='register-form-container'>
        <ErrorMessage message={errorMessage} errRef={errRef}/>
        <h1 className='register-form-title'>Rejestracja</h1>
        <form className='register-form' onSubmit={handleSubmit}>
          <TextInput
            label='Nazwa użytkownika'
            id='username'
            ref={userRef}
            value={user}
            onChange={(e) => setUser(e.target.value)}
            isValid={validName}
            isFocused={userFocus}
            onFocus={() => setUserFocus(true)}
            onBlur={() => setUserFocus(false)}
            helperText={
              `Od ${LENGTH_LIMITS.USERNAME_MIN} do ${LENGTH_LIMITS.USERNAME_MAX} znaków.` +
              'Litery, cyfry, podkreślniki, myślniki są dozwolone.'}
          />

          <TextInput 
            label='Adres e-mail:'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isValid={validEmail}
            isFocused={emailFocus}
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            helperText='Wprowadź poprawny adres e-mail (np. przykład@domena.pl).'
          />

          <PasswordInput
            label='Hasło:'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isValid={validPassword}
            isFocused={passwordFocus}
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
            helperText={
              `Od ${LENGTH_LIMITS.PASSWORD_MIN} do ${LENGTH_LIMITS.PASSWORD_MAX} znaków. ` +
              'Musi zawierać dużą i małą literę, cyfrę i znak specjalny (!@#$%).'
            }
          />

          <PasswordInput
            label='Powtórz hasło:'
            id='confirm-password'
            value={matchPassword}
            onChange={(e) => setMatchPassword(e.target.value)}
            isValid={validMatch && validPassword}
            isFocused={matchFocus}
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
            helperText='Musi być zgodne z pierwszym polem hasła.'
          />

          <button 
            className='register-form-btn'
            disabled={!validName || !validEmail || !validPassword || !validMatch ? true : false}
          >
            Zarejestruj się
          </button>
          <p className='register-form-login'>
            Masz już konto?
            <br />
            <Link to='/login' className='register-form-link'>Zaloguj się</Link>
          </p>
        </form>
      </section>
    )}
    </>
  )
}

export default RegisterForm;
