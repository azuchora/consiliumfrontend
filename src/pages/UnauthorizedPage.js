import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import './UnauthorizedPage.css';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <section className="unauthorized-container">
      <div className="unauthorized-box">
        <FontAwesomeIcon icon={faBan} className="unauthorized-icon" />
        <h1 className="unauthorized-title">Brak uprawnień</h1>
        <p className="unauthorized-text">
          Nie masz uprawnień do wyświetlenia tej strony. Skontaktuj się z administratorem, jeśli uważasz, że to błąd.
        </p>
        <button onClick={goBack} className="unauthorized-button">
          Powrót
        </button>
      </div>
    </section>
  );
};

export default UnauthorizedPage;
