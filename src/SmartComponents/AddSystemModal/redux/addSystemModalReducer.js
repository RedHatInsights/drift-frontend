import types from './types';
import helpers from './helpers';

const initialState = {
    addSystemModalOpened: false,
    activeTab: 0,
    selectedSystemIds: [],
    selectedSystemContent: [],
    selectedBaselineContent: [],
    selectedHSPContent: []
};

export function addSystemModalReducer(state = initialState, action) {
    let newSelectedContent;

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
        case `${types.HANDLE_SYSTEM_SELECTION}`:
            newSelectedContent = helpers.makeSelections(action.payload.content, action.payload.isSelected, state.selectedSystemContent);

            return {
                ...state,
                selectedSystemContent: newSelectedContent
            };
        case `${types.HANDLE_BASELINE_SELECTION}`:
            newSelectedContent = helpers.makeSelections(action.payload.content, action.payload.isSelected, state.selectedBaselineContent);

            return {
                ...state,
                selectedBaselineContent: newSelectedContent
            };
        case `${types.HANDLE_HSP_SELECTION}`:
            newSelectedContent = helpers.makeHSPSelections(action.payload, state.selectedHSPContent);

            return {
                ...state,
                selectedHSPContent: newSelectedContent
            };
        case `${types.CLEAR_ALL_SELECTIONS}`:
            return {
                ...state,
                selectedSystemContent: [],
                selectedBaselineContent: [],
                selectedHSPContent: []
            };

        default:
            return state;
    }
}
