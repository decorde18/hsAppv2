import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';

import App from './App';

import store from './store';
// import { dotenv } from 'dotenv';

// dotenv.config({ path: '../config.env' });

// console.log(process.env.SUPABASE_KEY);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
