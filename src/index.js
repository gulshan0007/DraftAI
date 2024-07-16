import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {registerLicense} from '@syncfusion/ej2-base';
registerLicense("ORg4AjUWIQA/Gnt2U1hhQlJBfVddXGNWfFN0QXNddV50flRCcC0sT3RfQFljTn9SdkFjX3tbd3JXQg==")

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

reportWebVitals();