import promiseMiddleware from 'redux-promise-middleware';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

import { reducers } from '../SmartComponents/modules';

let registry;

export function init (...middleware) {
    if (registry) {
        throw new Error('store already initialized');
    }

    registry = getRegistry({}, [
        promiseMiddleware(),
        ...middleware
    ]);

    registry.register({
        compareReducer: reducers.compareReducer,
        addSystemModalReducer: reducers.addSystemModalReducer,
        errorAlertReducer: reducers.errorAlertReducer,
        filterDropdownReducer: reducers.filterDropdownReducer,
        exportReducer: reducers.exportReducer
    });

    return registry;
}

export function getStore () {
    return registry.getStore();
}

export function register (...args) {
    return registry.register(...args);
}
