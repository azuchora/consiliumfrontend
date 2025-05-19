import { Routes, Route } from 'react-router-dom';
import { ROLES } from './constants/roles';
import Layout from './components/Layout/Layout';
import UnauthorizedPage from './pages/UnauthorizedPage';
import MissingPage from './pages/MissingPage';
import RequireAuth from './components/auth/RequireAuth';
import PersistLogin from './components/auth/PersistLogin';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import VerifyPage from './pages/VerifyPage';
import BrowsePostsPage from './pages/BrowsePostsPage';
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public */}
        <Route path='register' element={<RegisterPage />} />   
        <Route path='unauthorized' element={<UnauthorizedPage />} />
        <Route path='/' element={<HomePage />} />

        <Route path='*' element={<MissingPage />} />

        {/* Private (except for login)*/}
        <Route element={<PersistLogin />}>
        
          <Route path='login' element={<LoginPage />} />

          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path='verify' element={<VerifyPage />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Verified]} />}>
            <Route path='main' element={<BrowsePostsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
