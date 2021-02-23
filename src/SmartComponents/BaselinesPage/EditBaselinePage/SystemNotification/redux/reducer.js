import types from './types';

const initialState = {
    deleteNotificationsModalOpened: false,
    systemsToDelete: [],
    systemNotificationIds: undefined,
    systemNotificationLoaded: false
};

export function systemNotificationsReducer(state = initialState, action) {
    switch (action.type) {
        case types.TOGGLE_DELETE_NOTIFICATION_MODAL:
            return {
                ...state,
                deleteNotificationsModalOpened: !state.deleteNotificationsModalOpened
            };
        case types.SET_SYSTEMS_TO_DELETE:
            return {
                ...state,
                systemsToDelete: action.payload
            };
        case `${types.DELETE_NOTIFICATIONS}_FULFILLED`:
            return {
                ...state,
                systemsToDelete: []
            };
        case `${types.GET_NOTIFICATIONS}_PENDING`:
            return {
                ...state,
                systemNotificationIds: undefined,
                systemNotificationLoaded: false
            };
        case `${types.GET_NOTIFICATIONS}_FULFILLED`:
            return {
                ...state,
                systemNotificationIds: action.payload,
                systemNotificationLoaded: true
            };

        default:
            return {
                ...state
            };
    }
}
