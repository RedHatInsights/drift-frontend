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

function handleSystemSelection(content, isSelected) {
    return {
        type: types.HANDLE_SYSTEM_SELECTION,
        payload: { content, isSelected }
    };
}

function handleBaselineSelection(content, isSelected) {
    return {
        type: types.HANDLE_BASELINE_SELECTION,
        payload: { content, isSelected }
    };
}

function handleHSPSelection(content) {
    return {
        type: types.HANDLE_HSP_SELECTION,
        payload: content
    };
}

export default {
    toggleAddSystemModal,
    selectActiveTab,
    setSelectedSystemIds,
    handleSystemSelection,
    handleBaselineSelection,
    handleHSPSelection
};
