import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { init } from './store';
import App from './App';
import { RegistryContext } from './Utilities/registry';

const Drift = () => {
    const [ registry, setRegistry ] = useState();
    const store = registry?.registry.getStore();

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
                <App/>
            </Provider>
        </RegistryContext.Provider> : '';
};

export default Drift;
