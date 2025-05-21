import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path='/*' element={<App/>}/>
        </Routes>
      </SocketProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
