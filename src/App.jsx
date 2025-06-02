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
import PostPage from './pages/PostPage';
import UserProfilePage from './pages/UserProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SetPasswordPage from './pages/SetPasswordPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public */}
        <Route path='register' element={<RegisterPage />} />   
        <Route path='unauthorized' element={<UnauthorizedPage />} />
        <Route path='reset-password' element={<ResetPasswordPage />} />
        <Route path='reset-password/:token' element={<SetPasswordPage />} />
        <Route path='/' element={<HomePage />} />

        <Route path='*' element={<MissingPage />} />

        {/* Private (except for login)*/}
        <Route element={<PersistLogin />}>
        
          <Route path='login' element={<LoginPage />} />

          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path='verify' element={<VerifyPage />} />
            <Route path='change-password' element={<ChangePasswordPage />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Verified]} />}>
            <Route path='posts' element={<BrowsePostsPage />} />
            <Route path='posts/:id' element={<PostPage />} />
            <Route path='users/:username' element={<UserProfilePage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
