import types from './types';

const initialState = {
    addSystemModalOpened: false,
    activeTab: 0,
    selectedSystemIds: []
};

export function addSystemModalReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.OPEN_ADD_SYSTEM_MODAL}`:
            return {
                ...state,
                addSystemModalOpened: !state.addSystemModalOpened
            };
        case `${types.SELECT_ACTIVE_TAB}`:
            return {
                ...state,
                activeTab: action.payload
            };
        case `${types.SET_SELECTED_SYSTEMS_COMPARISON}`:
            return {
                ...state,
                selectedSystemIds: action.payload
            };

        default:
            return state;
    }
}
