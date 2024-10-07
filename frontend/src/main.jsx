// // // src/main.jsx

// // import React from 'react';
// // import ReactDOM from 'react-dom/client';
// // import App from './App';
// // import './index.css';

// // ReactDOM.createRoot(document.getElementById('root')).render(
// //   <React.StrictMode>
// //     <App />
// //   </React.StrictMode>,
// // );








// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { Auth0Provider } from '@auth0/auth0-react';
// import App from './App';
// import { useNavigate } from 'react-router-dom';

// const root = createRoot(document.getElementById('root'));

// // Define the redirect after login
// const onRedirectCallback = (appState) => {
//   window.location.href = 'http://localhost:5173/Counselor-Login';
// };

// root.render(
//   <Auth0Provider
//     domain="dev-dedaezfkps23cxcu.us.auth0.com"
//     clientId="ncNbat5Fm7Z5NFgLGCl4lKO79WAfKkGy"
//     authorizationParams={{
//       redirect_uri: window.location.origin
//     }}
//     onRedirectCallback={onRedirectCallback}
//   >
//     <App />
//   </Auth0Provider>,
// );





import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import { useNavigate } from 'react-router-dom';

const root = createRoot(document.getElementById('root'));

// Define the redirect after login
const onRedirectCallback = (appState) => {
  window.location.href = 'https://localhost:5173/login-options';
};

root.render(
  <Auth0Provider
    domain="dev-dedaezfkps23cxcu.us.auth0.com"
    clientId="ncNbat5Fm7Z5NFgLGCl4lKO79WAfKkGy"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
);
