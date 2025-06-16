import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketProvider';
import { ThemeProvider } from '@emotion/react';
import Theme from './context/Theme';
import { NotificationsProvider } from './context/NotificationsProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider theme={Theme}>
      <AuthProvider>
        <SocketProvider>
          <NotificationsProvider>
            <Routes>
              <Route path='/*' element={<App/>}/>
            </Routes>
          </NotificationsProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
