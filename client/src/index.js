import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Auth0Provider} from "./react-auth0-spa";
import HelmetProvider from "./components/HelmetProvider";
import {HashRouter as Router} from "react-router-dom";
import history from "./util/history";
import config from "./auth_config.json";

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  history.replace(window.location.hash ? window.location.hash : window.location.pathname);
};

ReactDOM.render(
  <Router history={history}>
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <HelmetProvider>
        <App/>
      </HelmetProvider>
    </Auth0Provider>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
