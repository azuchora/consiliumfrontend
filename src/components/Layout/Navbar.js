import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';
import './Navbar.css';
import { BACKEND_URL } from '../../api/axios';
import { faSignInAlt, faUserPlus, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = () => {
  const { isAuthed, username, avatar, isVerified } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">Consilium</Link>
        </div>

        <div className="navbar-right">
          <button className="menu-toggle mobile-only" onClick={toggleMenu} aria-label="Otwórz menu">
            <FontAwesomeIcon icon={faBars} />
          </button>

          {!isAuthed() ? (
            <div className='navbar-login desktop-only'>
              <Link to="/login" className="navbar-link">
                <FontAwesomeIcon icon={faSignInAlt} style={{marginRight: '0.5rem'}}/>
                Zaloguj
              </Link>
              <Link to="/register" className="navbar-link">
                <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '0.5rem' }} />
                Zarejestruj
              </Link>
            </div>
          ) : (
            <div className="navbar-user desktop-only" ref={dropdownRef}>
              <img
                src={`${BACKEND_URL}/static/${avatar}`}
                alt="Avatar"
                className="navbar-avatar"
              />
              <span className="navbar-username">{username}</span>
              <button className="settings-button" onClick={toggleDropdown} aria-label="Ustawienia">
                ⚙️
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {!isVerified() && (
                    <button onClick={() => navigate('/verify')} className='dropdown-item'>
                      Weryfikacja
                    </button>
                  )}

                  <button onClick={handleLogout} className="dropdown-item">
                    Wyloguj
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="side-menu-links">
          <Link to="/" onClick={toggleMenu}>Strona główna</Link>
          {!isAuthed() ? (
            <>
              <Link to="/login" onClick={toggleMenu}>Zaloguj</Link>
              <Link to="/register" onClick={toggleMenu}>Zarejestruj</Link>
            </>
          ) : (
            <>
              {!isVerified() && (
                <>
                  <Link to='/posts' onClick={toggleMenu}>Forum</Link>
                  <Link to='/verify' onClick={toggleMenu}>Weryfikacja</Link>
                </>    
              )}
              <button onClick={() => { handleLogout(); toggleMenu(); }}>Wyloguj</button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
