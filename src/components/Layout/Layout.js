import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import './Layout.css';

const Layout = () => {
  return (
    <main className='App'>
      <Navbar />
      <section className='app-content'>
        <Outlet />
      </section>
      <Footer />
    </main>
  )
}

export default Layout;
