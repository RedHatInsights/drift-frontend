import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import logger from 'redux-logger';

import getBaseName from './Utilities/getBaseName';

const Drift = () => {
    const [ registry, setRegistry ] = useState();
    const store = registry?.getStore();

    useEffect(() => {
        setRegistry(IS_DEV ? init(logger) : init());
        return () => {
            setRegistry(undefined);
        };
    }, []);

    return (

        <Provider store={ store }>
            <Router basename={ getBaseName(window.location.pathname) }>
                <App />
            </Router>
        </Provider>

    );
};

export default Drift;
