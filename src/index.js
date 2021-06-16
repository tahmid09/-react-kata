/**
 * This is the entry point of the application.
 * You don't need to keep the current code, feel free to modify it.
 * Default output of this code is 'Hello world!' in console.
 */
// import App from './App';

// App();

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
);
