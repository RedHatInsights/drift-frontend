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

export default {
    toggleAddSystemModal,
    selectActiveTab
};
