import promiseMiddleware from 'redux-promise-middleware';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

import { compareReducer } from '../SmartComponents/modules/reducers';
import { addSystemModalReducer } from '../SmartComponents/AddSystemModal/redux/addSystemModalReducer';
import { baselinesTableReducer } from '../SmartComponents/BaselinesTable/redux/baselinesTableReducer';
import { errorAlertReducer } from '../SmartComponents/ErrorAlert/redux/errorAlertReducer';
import { filterDropdownReducer } from '../SmartComponents/DriftPage/FilterDropDown/redux/filterDropdownReducer';
import { actionKebabReducer } from '../SmartComponents/DriftPage/ActionKebab/redux/actionKebabReducer';
import { baselinesPageReducer } from '../SmartComponents/BaselinesPage/redux/baselinesPageReducer';
import { baselinesKebabReducer } from '../SmartComponents/BaselinesPage/BaselinesKebab/redux/baselinesKebabReducer';

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
        compareState: compareReducer,
        addSystemModalState: addSystemModalReducer,
        baselinesTableState: baselinesTableReducer,
        errorAlertOpened: errorAlertReducer,
        filterDropdownOpened: filterDropdownReducer,
        kebabOpened: actionKebabReducer,
        baselinesPageState: baselinesPageReducer,
        baselinesKebabState: baselinesKebabReducer
    });

    return registry;
}

export function getStore () {
    return registry.getStore();
}

export function register (...args) {
    return registry.register(...args);
}
