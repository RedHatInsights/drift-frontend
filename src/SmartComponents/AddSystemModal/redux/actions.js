import types from './types';

function toggleAddSystemModal() {
    return {
        type: types.OPEN_ADD_SYSTEM_MODAL
    };
}

function selectActiveTab(newActiveTab) {
    return {
        type: types.SELECT_ACTIVE_TAB,
        payload: newActiveTab
    };
}

function setSelectedSystemIds(selectedSystemIds) {
    return {
        type: types.SET_SELECTED_SYSTEMS_COMPARISON,
        payload: selectedSystemIds
    };
}

export default {
    toggleAddSystemModal,
    selectActiveTab,
    setSelectedSystemIds
};
