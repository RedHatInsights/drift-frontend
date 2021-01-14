import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';

import getBaseName from './Utilities/getBaseName';

const Drift = ({ logger }) => (
    <Provider store={ init(logger).getStore() }>
        <Router basename={ getBaseName(window.location.pathname) }>
            <App/>
        </Router>
    </Provider>
);

Drift.propTypes = {
    logger: PropTypes.any
};

export default Drift;
