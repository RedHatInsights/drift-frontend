import promiseMiddleware from 'redux-promise-middleware';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

import { compareReducer, globalFilterReducer } from '../SmartComponents/modules/reducers';
import { addSystemModalReducer } from '../SmartComponents/AddSystemModal/redux/addSystemModalReducer';
import { baselinesTableRootReducer } from '../SmartComponents/BaselinesTable/redux';
import { filterDropdownReducer } from '../SmartComponents/DriftPage/FilterDropDown/redux/filterDropdownReducer';
import { createBaselineModalReducer } from '../SmartComponents/BaselinesPage/CreateBaselineModal/redux/reducers';
import { editBaselineReducer } from '../SmartComponents/BaselinesPage/EditBaseline/redux/reducers';
import { historicProfilesReducer } from '../SmartComponents/HistoricalProfilesDropdown/redux/reducers';

import MiddlewareListener from '@redhat-cloud-services/frontend-components-utilities/files/MiddlewareListener';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
export { default as reducers } from './reducers';

let registry;
let middlewareListener;

export const createMiddlewareListener = () => {
    middlewareListener = new MiddlewareListener();
    return middlewareListener;
};

export function init (...middleware) {
    if (registry) {
        throw new Error('store already initialized');
    }

    createMiddlewareListener();

    registry = getRegistry({}, [
        promiseMiddleware(),
        middlewareListener.getMiddleware(),
        ...middleware
    ]);

    registry.register({
        compareState: compareReducer,
        addSystemModalState: addSystemModalReducer,
        baselinesTableState: baselinesTableRootReducer,
        filterDropdownOpened: filterDropdownReducer,
        createBaselineModalState: createBaselineModalReducer,
        editBaselineState: editBaselineReducer,
        historicProfilesState: historicProfilesReducer,
        notifications,
        globalFilterState: globalFilterReducer
    });

    return registry;
}

export function getStore () {
    return registry.getStore();
}

export function register (...args) {
    return registry.register(...args);
}

export function addNewListener ({ actionType, callback }) {
    return middlewareListener.addNew({
        on: actionType,
        callback
    });
}
