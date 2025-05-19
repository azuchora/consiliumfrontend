import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import './MissingPage.css';

const MissingPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="missing-container">
      <div className="missing-box">
        <FontAwesomeIcon icon={faTriangleExclamation} className="missing-icon" />
        <h1 className="missing-title">404 - Nie znaleziono strony</h1>
        <p className="missing-text">
          Przepraszamy, ale strona, której szukasz, nie istnieje lub została przeniesiona.
        </p>
        <button className="missing-button" onClick={handleGoHome}>
          Wróć do strony głównej
        </button>
      </div>
    </div>
  );
};

export default MissingPage;
