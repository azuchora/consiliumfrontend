import { Link } from "react-router-dom";

const SuccessMessage = () => (
  <section>
    <h1>Sukces!</h1>
    <p>
      <Link to='/login'>Zaloguj się</Link>
    </p>
  </section>
);

export default SuccessMessage;
