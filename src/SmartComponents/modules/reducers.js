import types from './types';

const initialState = {
    compare: {},
    status: {},
    addSystemModalOpened: false,
    selectedSystemIds: []
};

function selectedSystems(selectedIds, selectedSystem) {
    let id = selectedSystem.id;

    if (selectedSystem.selected && !selectedIds.includes(id)) {
        selectedIds.push(id);
    } else if (!selectedSystem.selected) {
        selectedIds = selectedIds.filter(item => item !== id);
    }

    return selectedIds;
}

function compareReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.FETCH_COMPARE}_FULFILLED`:
            return {
                ...state,
                compare: action.payload,
                selectedSystemIds: action.payload.metadata.map(system => system.id)
            };
        case 'SELECT_ENTITY':
            return {
                ...state,
                selectedSystemIds: selectedSystems([ ...state.selectedSystemIds ], action.payload)
            };

        default:
            return {
                ...state
            };
    }
}

function statusReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.FETCH_STATUS}_FULFILLED`:
            return {
                ...state,
                status: action.payload
            };
        case `${types.OPEN_ADD_SYSTEM_MODAL}`:
            return {
                ...state,
                addSystemModalOpened: !state.addSystemModalOpened
            };

        default:
            return {
                ...state
            };
    }
}

export default {
    compareReducer,
    statusReducer
};
