import { Routes, Route } from 'react-router-dom';
import { Testowy } from './components/Testowy';
import { ROLES } from './constants/roles';
import Layout from './components/Layout/Layout';
import Unauthorized from './components/messages/Unauthorized';
import Missing from './components/messages/Missing';
import RequireAuth from './components/auth/RequireAuth';
import PersistLogin from './components/auth/PersistLogin';
import RegisterForm from './components/forms/RegisterForm';
import LoginForm from './components/forms/LoginForm';
import VerifyForm from './components/forms/VerifyForm';
import PostsFeed from './components/posts/PostsFeed';
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public */}
        <Route path='register' element={<RegisterForm />} />   
        <Route path='unauthorized' element={<Unauthorized />} />

        <Route path='*' element={<Missing />} />

        {/* Private (except for login)*/}
        <Route element={<PersistLogin />}>
        
          <Route path='login' element={<LoginForm />} />

          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path='verify' element={<VerifyForm />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Verified]} />}>
            <Route path='home' element={<PostsFeed />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
