import promiseMiddleware from 'redux-promise-middleware';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

import { compareReducer, globalFilterReducer } from '../SmartComponents/modules/reducers';
import { addSystemModalReducer } from '../SmartComponents/AddSystemModal/redux/addSystemModalReducer';
import { baselinesTableRootReducer } from '../SmartComponents/BaselinesTable/redux';
import { filterDropdownReducer } from '../SmartComponents/DriftPage/FilterDropDown/redux/filterDropdownReducer';
import { createBaselineModalReducer } from '../SmartComponents/BaselinesPage/CreateBaselineModal/redux/reducers';
import { editBaselineReducer } from '../SmartComponents/BaselinesPage/EditBaselinePage/redux/reducers';
import { historicProfilesReducer } from '../SmartComponents/HistoricalProfilesPopover/redux/reducers';
import { systemNotificationsReducer } from '../SmartComponents/BaselinesPage/EditBaselinePage/SystemNotification/redux/reducer';

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
    createMiddlewareListener();

    registry = getRegistry({}, [
        promiseMiddleware(),
        middlewareListener.getMiddleware(),
        ...middleware.filter(item => typeof item !== 'undefined')
    ]);

    registry.register({
        compareState: compareReducer,
        addSystemModalState: addSystemModalReducer,
        baselinesTableState: baselinesTableRootReducer,
        filterDropdownOpened: filterDropdownReducer,
        createBaselineModalState: createBaselineModalReducer,
        editBaselineState: editBaselineReducer,
        historicProfilesState: historicProfilesReducer,
        systemNotificationsState: systemNotificationsReducer,
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
