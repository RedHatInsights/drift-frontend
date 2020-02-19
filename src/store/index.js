import promiseMiddleware from 'redux-promise-middleware';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

import { compareReducer } from '../SmartComponents/modules/reducers';
import { addSystemModalReducer } from '../SmartComponents/AddSystemModal/redux/addSystemModalReducer';
import { baselinesTableRootReducer } from '../SmartComponents/BaselinesTable/redux';
import { errorAlertReducer } from '../SmartComponents/ErrorAlert/redux/errorAlertReducer';
import { filterDropdownReducer } from '../SmartComponents/DriftPage/FilterDropDown/redux/filterDropdownReducer';
import { actionKebabReducer } from '../SmartComponents/DriftPage/ActionKebab/redux/actionKebabReducer';
import { exportCSVButtonReducer } from '../SmartComponents/BaselinesPage/ExportCSVButton/redux/exportCSVButtonReducer';
import { createBaselineModalReducer } from '../SmartComponents/BaselinesPage/CreateBaselineModal/redux/reducers';
import { editBaselineReducer } from '../SmartComponents/BaselinesPage/EditBaseline/redux/reducers';
import { historicProfilesReducer } from '../SmartComponents/HistoricalProfilesDropdown/redux/reducers';

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
        baselinesTableState: baselinesTableRootReducer,
        errorAlertOpened: errorAlertReducer,
        filterDropdownOpened: filterDropdownReducer,
        kebabOpened: actionKebabReducer,
        exportCSVButtonState: exportCSVButtonReducer,
        createBaselineModalState: createBaselineModalReducer,
        editBaselineState: editBaselineReducer,
        historicProfilesState: historicProfilesReducer
    });

    return registry;
}

export function getStore () {
    return registry.getStore();
}

export function register (...args) {
    return registry.register(...args);
}
