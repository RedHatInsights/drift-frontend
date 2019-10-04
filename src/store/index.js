import promiseMiddleware from 'redux-promise-middleware';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

import { compareReducer } from '../SmartComponents/modules/reducers';
import { addSystemModalReducer } from '../SmartComponents/AddSystemModal/redux/addSystemModalReducer';
import { baselinesTableReducer } from '../SmartComponents/BaselinesTable/redux/baselinesTableReducer';
import { errorAlertReducer } from '../SmartComponents/ErrorAlert/redux/errorAlertReducer';
import { filterDropdownReducer } from '../SmartComponents/DriftPage/FilterDropDown/redux/filterDropdownReducer';
import { actionKebabReducer } from '../SmartComponents/DriftPage/ActionKebab/redux/actionKebabReducer';
import { factModalReducer } from '../SmartComponents/BaselinesPage/EditBaseline/FactModal/redux/reducers';
import { baselinesKebabReducer } from '../SmartComponents/BaselinesPage/BaselinesKebab/redux/baselinesKebabReducer';
import { createBaselineModalReducer } from '../SmartComponents/BaselinesPage/CreateBaselineModal/redux/reducers';

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
        factModalState: factModalReducer,
        baselinesKebabState: baselinesKebabReducer,
        createBaselineModalState: createBaselineModalReducer
    });

    return registry;
}

export function getStore () {
    return registry.getStore();
}

export function register (...args) {
    return registry.register(...args);
}
