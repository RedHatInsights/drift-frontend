import types from './types';

function toggleFactModal() {
    return {
        type: types.TOGGLE_FACT_MODAL
    };
}

function setFactData(factData) {
    return {
        type: types.SET_FACT_DATA,
        payload: factData
    };
}

export default {
    toggleFactModal,
    setFactData
};
