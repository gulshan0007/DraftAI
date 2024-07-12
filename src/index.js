import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {registerLicense} from '@syncfusion/ej2-base';
registerLicense("ORg4AjUWIQA/Gnt2U1hhQlJBfVddWnxLflFyVWZTfl96cVZWESFaRnZdRl1kSXZTc0FmXX9XdndW")

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

reportWebVitals();