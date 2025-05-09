import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const PasswordInput = ({
  label,
  id,
  value,
  onChange,
  isValid,
  isFocused,
  onFocus,
  onBlur,
  helperText,
}) => {
  return (
    <>
      <label htmlFor={id} className='register-form-label'>
        {label}
        <FontAwesomeIcon icon={faCheck} className={isValid ? 'valid' : 'hide'} />
        <FontAwesomeIcon icon={faTimes} className={isValid || !value ? 'hide' : 'invalid'} />
      </label>
      <input
        className='register-form-input'
        type='password'
        id={id}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete='new-password'
        required
        aria-invalid={isValid ? 'false' : 'true'}
        aria-describedby={`${id}-note`}
      />
      <p id={`${id}-note`} className={isFocused && !isValid ? 'instructions' : 'offscreen'}>
        <FontAwesomeIcon icon={faInfoCircle} /> {helperText}
      </p>
    </>
  );
};

export default PasswordInput;
