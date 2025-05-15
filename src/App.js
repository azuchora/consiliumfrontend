import RegisterForm from './components/RegisterForm/RegisterForm';
import LoginForm from './components/LoginForm/LoginForm';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Unauthorized from './components/messages/Unauthorized';
import Missing from './components/messages/Missing';
import RequireAuth from './components/RequireAuth/RequireAuth';
import { Testowy } from './components/Testowy';
import { ROLES } from './constants/roles';
import "./App.css";
import VerifyForm from './components/VerifyForm/VerifyForm';
import PersistLogin from './components/PersistLogin/PersistLogin';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public */}
        <Route path='login' element={<LoginForm />} />
        <Route path='register' element={<RegisterForm />} />   
        <Route path='unauthorized' element={<Unauthorized />} />

        <Route path='*' element={<Missing />} />

        {/* Private (role + auth based)  */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path='verify' element={<VerifyForm />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Verified]} />}>
            <Route path='home' element={<Testowy />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
