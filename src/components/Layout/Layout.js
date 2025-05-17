import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.css';

const Layout = () => {
  return (
    <main className='App'>
      <Navbar />
      <section className='app-content'>
        <Outlet />
      </section>
    </main>
  )
}

export default Layout;
