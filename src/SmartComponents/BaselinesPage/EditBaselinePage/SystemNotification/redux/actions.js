import types from './types';
import api from '../../../../../api';

function toggleDeleteNotificationsModal() {
    return {
        type: types.TOGGLE_DELETE_NOTIFICATION_MODAL
    };
}

function setSystemsToDelete(systemIds) {
    return {
        type: types.SET_SYSTEMS_TO_DELETE,
        payload: systemIds
    };
}

function deleteNotifications(baselineId, systemIds) {
    return {
        type: types.DELETE_NOTIFICATIONS,
        payload: api.deleteSystemNotifications(baselineId, systemIds)
    };
}

function getNotifications(baselineId) {
    return {
        type: types.GET_NOTIFICATIONS,
        payload: api.getBaselineNotification(baselineId)
    };
}

export default {
    toggleDeleteNotificationsModal,
    setSystemsToDelete,
    deleteNotifications,
    getNotifications
};
