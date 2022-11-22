import { useState } from 'react';
import promiseMiddleware from 'redux-promise-middleware';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';

import { compareReducer, globalFilterReducer } from '../SmartComponents/modules/reducers';
import { addSystemModalReducer } from '../SmartComponents/AddSystemModal/redux/addSystemModalReducer';
import { baselinesTableRootReducer } from '../SmartComponents/BaselinesTable/redux';
import { filterDropdownReducer } from '../SmartComponents/DriftPage/FilterDropDown/redux/filterDropdownReducer';
import { createBaselineModalReducer } from '../SmartComponents/BaselinesPage/CreateBaselineModal/redux/reducers';
import { editBaselineReducer } from '../SmartComponents/BaselinesPage/EditBaselinePage/redux/reducers';
import { historicProfilesReducer } from '../SmartComponents/HistoricalProfilesPopover/redux/reducers';
import { systemNotificationsReducer } from '../SmartComponents/BaselinesPage/EditBaselinePage/SystemNotification/redux/reducer';

import MiddlewareListener from '@redhat-cloud-services/frontend-components-utilities/MiddlewareListener';
import { notifications } from '@redhat-cloud-services/frontend-components-notifications';
export { default as reducers } from './reducers';

export const createMiddlewareListener = () => {
    const [ middle, setMiddle ] = useState();
    setMiddle(new MiddlewareListener());
    return [ middle, setMiddle ];
};

export function init (...middleware) {
    const [ reg, setReg ] = useState();
    const [ middle ] = createMiddlewareListener();

    setReg(getRegistry({}, [
        promiseMiddleware,
        middle.getMiddleware(),
        ...middleware.filter(item => typeof item !== 'undefined')
    ]));

    reg.register({
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

    return [ reg, middle ];
}

export function getStore () {
    const temp = init();
    return temp.getStore();
}

export function register (...args) {
    const temp = init();
    return temp.register(...args);
}

export function addNewListener ({ actionType, callback }) {
    const [ setMiddle ] = createMiddlewareListener();
    return setMiddle.addNew({
        on: actionType,
        callback
    });
}
