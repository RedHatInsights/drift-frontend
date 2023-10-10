import types from './types';
import api from '../../../../../api';

export function toggleDeleteNotificationsModal() {
    return {
        type: types.TOGGLE_DELETE_NOTIFICATION_MODAL
    };
}

export function setSystemsToDelete(systemIds) {
    return {
        type: types.SET_SYSTEMS_TO_DELETE,
        payload: systemIds
    };
}

export function deleteNotifications(baselineId, systemIds) {
    return {
        type: types.DELETE_NOTIFICATIONS,
        payload: api.deleteSystemNotifications(baselineId, systemIds)
    };
}

export function getNotifications(baselineId) {
    return {
        type: types.GET_NOTIFICATIONS,
        payload: api.getBaselineNotification(baselineId)
    };
}

export function addNotifications(baselineId, systemsToAdd) {
    return {
        type: types.ADD_NOTIFICATIONS,
        payload: api.addSystemNotification(baselineId, systemsToAdd)
    };
}

