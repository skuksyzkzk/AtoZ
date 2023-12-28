import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Web3Provider, Web3ReactProvider} from '@web3-react/core';
import { getProvider } from './utils/provider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Web3ReactProvider getLibrary={getProvider}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Web3ReactProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
