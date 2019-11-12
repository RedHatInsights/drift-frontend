import types from './types';
import api from '../../../../api';

function expandRow(factName) {
    return {
        type: types.EXPAND_PARENT_FACT,
        payload: factName
    };
}

function fetchBaselineData(baselineUUID) {
    return {
        type: types.FETCH_BASELINE_DATA,
        payload: api.getBaselineData(baselineUUID)
    };
}

function patchBaseline(baselineId, apiBody) {
    return {
        type: types.PATCH_BASELINE,
        payload: api.patchBaselineData(baselineId, apiBody)
    };
}

function toggleEditNameModal() {
    return {
        type: types.TOGGLE_EDIT_NAME_MODAL
    };
}

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

function selectFact(ids, isSelected) {
    return {
        type: types.SELECT_FACT,
        payload: { ids, isSelected }
    };
}

export default {
    expandRow,
    fetchBaselineData,
    patchBaseline,
    setFactData,
    toggleEditNameModal,
    toggleFactModal,
    selectFact
};
