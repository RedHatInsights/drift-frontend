import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import { RegistryContext } from './Utilities/registry';

const Drift = () => {
    const [ registry, setRegistry ] = useState();
    const store = registry?.registry.getStore();

    useEffect(() =>{
        setRegistry(init());

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
