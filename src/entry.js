import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';

import { init } from './store';
import App from './App';
import getBaseName from './Utilities/getBaseName';

ReactDOM.render(
    <Provider store={ init().getStore() }>
        <CookiesProvider>
            <Router basename={ getBaseName(window.location.pathname) }>
                <App />
            </Router>
        </CookiesProvider>
    </Provider>,
    document.getElementById('root')
);
