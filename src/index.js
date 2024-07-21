import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

if (typeof ResizeObserver !== 'undefined') {
  const ro = new ResizeObserver(() => {});
  ro.observe(document.body);
  ro.unobserve(document.body);
  ro.disconnect();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
