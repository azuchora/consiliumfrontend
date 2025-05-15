import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const FormTextInput = ({
  label,
  id,
  ref=null,
  value,
  onChange,
  isValid,
  isFocused,
  onFocus,
  onBlur,
  helperText,
  cName=null,
}) => {
  return (
    <>
      <label htmlFor={id} className={`${cName}-label`}>
        {label}
        <span className={isValid ? 'valid' : 'hide'}>
          <FontAwesomeIcon icon={faCheck} />
        </span>
        <span className={isValid || !value ? 'hide' : 'invalid'}>
          <FontAwesomeIcon icon={faTimes} />
        </span>
      </label>
      <input
        className={`${cName}-input`}
        type='text'
        id={id}
        ref={ref}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete='off'
        required
        aria-invalid={isValid ? 'false' : 'true'}
        aria-describedby={`${id}-note`}
      />
      <p id={`${id}-note`} className={isFocused && value && !isValid ? 'instructions' : 'offscreen'}>
        <FontAwesomeIcon icon={faInfoCircle} /> {helperText}
      </p>
    </>
  );
};

export default FormTextInput;
