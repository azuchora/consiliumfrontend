import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';
import { BACKEND_URL } from '../../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faBars, faTimes, faCog } from '@fortawesome/free-solid-svg-icons';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
  const { isAuthed, username, avatar, isVerified } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

  const guestLinks = [
    { to: '/login', label: 'Zaloguj', icon: faSignInAlt },
    { to: '/register', label: 'Zarejestruj', icon: faUserPlus }
  ];

  // Handler for avatar/username click (both desktop and mobile)
  const handleProfileClick = () => {
    if (username) {
      navigate(`/users/${username}`);
      setDrawerOpen(false);
      setAnchorEl(null);
    }
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: 1,
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            Consilium
          </Typography>

          {/* Desktop */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Forum button always visible */}
              <Button
                component={Link}
                to="/posts"
                color="secondary"
                variant="contained"
                size="small"
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                Forum
              </Button>
              {!isAuthed() ? (
                guestLinks.map((link) => (
                  <Button
                    key={link.to}
                    component={Link}
                    to={link.to}
                    color="secondary"
                    variant="contained"
                    size="small"
                    startIcon={<FontAwesomeIcon icon={link.icon} />}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                  >
                    {link.label}
                  </Button>
                ))
              ) : (
                <>
                  <Box
                    onClick={handleProfileClick}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      px: 1,
                      py: 0.5,
                      borderRadius: 2,
                      transition: 'background 0.15s',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.12)'
                      }
                    }}
                  >
                    <Avatar
                      src={avatar ? `${BACKEND_URL}/static/${avatar}` : undefined}
                      alt={username}
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: theme.palette.secondary.main,
                        color: '#fff'
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#fff',
                        fontWeight: 600,
                        ml: 0,
                        userSelect: 'none'
                      }}
                    >
                      {username}
                    </Typography>
                  </Box>
                  <IconButton
                    color="inherit"
                    onClick={handleMenuOpen}
                    aria-label="Ustawienia"
                    size="large"
                    sx={{ p: 1, ml: 1 }}
                  >
                    <FontAwesomeIcon icon={faCog} fontSize="26px" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    disableScrollLock
                  >
                    {!isVerified() && (
                      <MenuItem onClick={() => { navigate('/verify'); handleMenuClose(); }}>
                        Weryfikacja
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>Wyloguj</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}

          {/* Mobile */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              aria-label="menu"
              size="large"
            >
              <FontAwesomeIcon icon={faBars} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: { width: 260, bgcolor: theme.palette.primary.main, color: '#fff' }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 0 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff', fontWeight: 700 }}>
            Consilium
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 1 }} />
        <List>
          {!isAuthed() ? (
            guestLinks.map((link) => (
              <ListItem
                key={link.to}
                component={Link}
                to={link.to}
                onClick={handleDrawerToggle}
                sx={{
                  color: '#fff',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': { bgcolor: theme.palette.secondary.main, color: '#fff' }
                }}
                button={true}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 36 }}>
                  <FontAwesomeIcon icon={link.icon} />
                </ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItem>
            ))
          ) : (
            <>
              <ListItem
                sx={{
                  py: 1,
                  cursor: 'pointer',
                  borderRadius: 2,
                  transition: 'background 0.15s',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.12)'
                  }
                }}
                onClick={handleProfileClick}
              >
                <Avatar
                  src={avatar ? `${BACKEND_URL}/static/${avatar}` : undefined}
                  alt={username}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: theme.palette.secondary.main,
                    color: '#fff',
                    mr: 1
                  }}
                />
                <ListItemText
                  primary={username}
                  primaryTypographyProps={{ color: '#fff', fontWeight: 600 }}
                />
              </ListItem>
              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 1 }} />
              <ListItem
                component={Link}
                to="/"
                onClick={handleDrawerToggle}
                sx={{ color: '#fff', borderRadius: 1, mb: 1 }}
                button={true}
              >
                <ListItemText primary="Strona główna" />
              </ListItem>
              <ListItem
                component={Link}
                to="/posts"
                onClick={handleDrawerToggle}
                sx={{ color: '#fff', borderRadius: 1, mb: 1 }}
                button={true}
              >
                <ListItemText primary="Forum" />
              </ListItem>
              {!isVerified() && (
                <ListItem
                  component={Link}
                  to="/verify"
                  onClick={handleDrawerToggle}
                  sx={{ color: '#fff', borderRadius: 1, mb: 1 }}
                  button={true}
                >
                  <ListItemText primary="Weryfikacja" />
                </ListItem>
              )}
              <ListItem
                onClick={handleLogout}
                sx={{
                  color: theme.palette.error.main,
                  borderRadius: 1,
                  mt: 1,
                  '&:hover': { bgcolor: theme.palette.error.main, color: '#fff' }
                }}
                button={true}
              >
                <ListItemText primary="Wyloguj" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;