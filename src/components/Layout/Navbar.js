import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';
import './Navbar.css';
import { BACKEND_URL } from '../../api/axios';

const Navbar = () => {
  const { auth } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
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
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">Consilium</Link>
      </div>

      <div className="navbar-right">
        {!auth?.accessToken ? (
          <>
            <Link to="/login" className="navbar-link">Zaloguj</Link>
            <Link to="/register" className="navbar-link">Zarejestruj</Link>
          </>
        ) : (
          <div className="navbar-user" ref={dropdownRef}>
            <img
              src={`${BACKEND_URL}/static/${auth.avatarFilename}`}
              alt="Avatar"
              className="navbar-avatar"
            />
            <span className="navbar-username">{auth.user}</span>
            <button
              className="settings-button"
              onClick={toggleDropdown}
              aria-label="Ustawienia"
            >
              ⚙️
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleLogout} className="dropdown-item">
                  Wyloguj
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
