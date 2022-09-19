import { getStore } from '../store';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

export function dispatchAction(actionCreator) {
    const store = getStore();
    return store.dispatch(actionCreator);
}

export const dispatchNotification = (notification) => {
    dispatchAction(addNotification(notification));
};
