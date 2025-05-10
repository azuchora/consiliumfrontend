import { useNavigate } from "react-router-dom";
import './Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <section className='unauthorized-container'>
      <h1>Brak uprawnień</h1>
      <br />
      <p>
        Nie posiadasz uprawnień do żądanej strony.
      </p>
      <button onClick={goBack}>Powrót</button>
    </section>
  )
}

export default Unauthorized;
