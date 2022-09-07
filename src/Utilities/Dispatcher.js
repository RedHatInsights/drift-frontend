//import { getStore } from '../store';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

export function dispatchAction(actionCreator, store) {
    //const store = getStore();
    return store.dispatch(actionCreator);
}

export const dispatchNotification = (notification, store) => {
    dispatchAction(addNotification(notification), store);
};
