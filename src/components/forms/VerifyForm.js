import { useState, useRef, useEffect } from 'react';
import { PESEL_REGEX, NAME_REGEX, SURNAME_REGEX, PWZ_REGEX } from '../../constants/validation';
import ErrorMessage from '../messages/ErrorMessage';
import { Link, useNavigate } from 'react-router-dom';
import './VerifyForm.css';
import FormTextInput from '../inputs/FormTextInput';
import useLogout from '../../hooks/useLogout';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useRefreshToken from '../../hooks/useRefreshToken';

const VerifyForm = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const axiosPrivate = useAxiosPrivate();
  const refresh = useRefreshToken();

  const signOut = async () => {
    await logout();
    navigate('/login');
  }

  const nameRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState('');
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [surname, setSurname] = useState('');
  const [validSurname, setValidSurname] = useState(false);
  const [surnameFocus, setSurnameFocus] = useState(false);

  const [pesel, setPesel] = useState('');
  const [validPesel, setValidPesel] = useState(false);
  const [peselFocus, setPeselFocus] = useState(false);

  const [pwz, setPwz] = useState('');
  const [validPwz, setValidPwz] = useState(false);
  const [pwzFocus, setPwzFocus] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  useEffect(() => {
    const result = NAME_REGEX.test(name);
    setValidName(result);
  }, [name]);

  useEffect(() => {
    const result = SURNAME_REGEX.test(surname);
    setValidSurname(result);
  }, [surname]);

  useEffect(() => {
    const result = PESEL_REGEX.test(pesel);
    setValidPesel(result);
  }, [pesel]);

  useEffect(() => {
    const result = PWZ_REGEX.test(pwz);
    setValidPwz(result);
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
    if(!v1 || !v2 || !v3 || !v4){
      setErrorMessage('Nieprawidłowe dane.')
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

    } catch (err){
      console.log(err)
      if(!err?.response){
        setErrorMessage('Nie można połączyć się z serwerem.');
      } else if (err.response?.status === 404){
        setErrorMessage('Nie można zweryfikować użytkownika.');
      } else {
        setErrorMessage('Błąd weryfikacji użytkownika.');
      }
      errRef.current.focus();
    }
  }
  
  return (
    <section className='verify-form-container'>
      <ErrorMessage message={errorMessage} errRef={errRef}/>
      <h1 className='verify-form-title'>Weryfikacja</h1>
      <form className='verify-form' onSubmit={handleSubmit}>
  
        <FormTextInput
          label='Imie:'
          id='name'
          cName='verify-form'
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          isValid={validName}
          isFocused={nameFocus}
          onFocus={() => setNameFocus(true)}
          onBlur={() => setNameFocus(false)}
          helperText='Wprowadź poprawne imie.'
        />

        <FormTextInput 
          label='Nazwisko:'
          id='surname'
          cName='register-form'
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          isValid={validSurname}
          isFocused={surnameFocus}
          onFocus={() => setSurnameFocus(true)}
          onBlur={() => setSurnameFocus(false)}
          helperText='Wprowadź poprawne nazwisko.'
        />

        <FormTextInput
          label='Numer PESEL:'
          id='pesel'
          cName='register-form'
          value={pesel}
          onChange={(e) => setPesel(e.target.value)}
          isValid={validPesel}
          isFocused={peselFocus}
          onFocus={() => setPeselFocus(true)}
          onBlur={() => setPeselFocus(false)}
          helperText='Wprowadź 11-cyfrowy numer PESEL.'
        />

        <FormTextInput
          label='Numer PWZ:'
          id='pwz'
          value={pwz}
          cName='register-form'
          onChange={(e) => setPwz(e.target.value)}
          isValid={validPwz}
          isFocused={pwzFocus}
          onFocus={() => setPwzFocus(true)}
          onBlur={() => setPwzFocus(false)}
          helperText='Wprowadź 7-cyfrowy numer PWZ.'
        />

        <button 
          className='verify-form-btn'
          disabled={!validName || !validSurname || !validPesel || !validPwz ? true : false}
        >
          Zweryfikuj
        </button>
        
        <Link className='verify-form-link' onClick={() => signOut()}>Wyloguj się</Link>
      </form>
    </section>
  )
}

export default VerifyForm;
