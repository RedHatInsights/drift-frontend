import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { init } from './store';
import App from './App';
import { RegistryContext } from './Utilities/registry';
import getBaseName from './Utilities/getBaseName';

const Drift = () => {
    const [ registry, setRegistry ] = useState();
    const store = registry?.registry.getStore();
    const basename = useMemo(() => getBaseName(window.location.pathname), []);

    useEffect(() =>{
        setRegistry(init(logger));

        return () => {
            setRegistry(undefined);
        };
    }, []);

    return registry ?
        <RegistryContext.Provider value={{
            ...registry
        }}>
            <Provider store={ store }>
                <Router basename={ basename }>
                    <App/>
                </Router>
            </Provider>
        </RegistryContext.Provider> : '';
};

export default Drift;
