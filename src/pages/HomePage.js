import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faFolderOpen, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">CONSILIUM</h1>
        <p className="home-subtitle">Forum dyskusyjne dla lekarzy</p>
      </header>

      <section className="home-hero">
        <h2 className="home-hero-title">Witamy w CONSILIUM</h2>
        <p className="home-hero-text">
          Wymieniaj się wiedzą, pytaj, konsultuj przypadki, ucz się razem z innymi specjalistami.
        </p>
        <div className="home-buttons">
            <button
              className="home-button-primary"
              onClick={() => navigate('/posts')}
            >
              Przejdź do forum
            </button>
          </div>
      </section>

      <section className="home-features">
        <div className="home-feature">
          <h3 className="home-feature-title">
            <FontAwesomeIcon icon={faComments} style={{ marginRight: '0.5rem' }} />
            Dyskusje specjalistyczne
          </h3>
          <p className="home-feature-text">
            Dołącz do konwersacji z lekarzami z różnych dziedzin i konsultuj trudne przypadki.
          </p>
        </div>
        <div className="home-feature">
          <h3 className="home-feature-title">
            <FontAwesomeIcon icon={faFolderOpen} style={{ marginRight: '0.5rem' }} />
            Archiwum przypadków
          </h3>
          <p className="home-feature-text">
            Przeglądaj zarchiwizowane przypadki i ucz się na podstawie doświadczeń innych.
          </p>
        </div>
        <div className="home-feature">
          <h3 className="home-feature-title">
            <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: '0.5rem' }} />
            Automatyczna cenzura danych wrażliwych
          </h3>
          <p className="home-feature-text">
            Automatyczna cenzura danych wrażliwych na zdjęciach i plikach tekstowych.
          </p>
        </div>
      </section>

      <footer className="home-footer">
        <p className="home-footer-text">&copy; 2025 CONSILIUM. Wszelkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
};

export default HomePage;
