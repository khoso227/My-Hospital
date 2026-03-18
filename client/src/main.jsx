import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n'; // i18n setup load karna zaroori hai
import { BrowserRouter } from 'react-router-dom';
import { configureAxios } from './utils/axiosConfig';

configureAxios();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
