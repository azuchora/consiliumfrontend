const ErrorMessage = ({ message, errRef }) => {
  return (
    <p
      ref={errRef}
      className={message ? 'errmsg' : 'offscreen'}
      aria-live='assertive'
    >
      {message}
    </p>
  );
};

export default ErrorMessage;
