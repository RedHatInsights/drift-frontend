import types from './types';
import api from '../../../api';

function fetchBaselines() {
    return {
        type: types.FETCH_BASELINE_LIST,
        payload: api.getBaselineList()
    };
}

function selectBaseline(rows) {
    return {
        type: types.SELECT_BASELINE,
        payload: rows
    };
}

function setSelectedBaselines(selectedBaselineIds) {
    return {
        type: types.SET_SELECTED_BASELINES,
        payload: selectedBaselineIds
    };
}

function clearSelectedBaselines() {
    return {
        type: types.CLEAR_SELECTED_BASELINES
    };
}

function fetchBaselineData(baselineUUID) {
    return {
        type: types.FETCH_BASELINE_DATA,
        payload: api.getBaselineData(baselineUUID)
    };
}

function addBaselineUUID(baselineUUID) {
    return {
        type: types.ADD_BASELINE_UUID,
        payload: baselineUUID
    };
}

function clearBaselineData() {
    return {
        type: types.CLEAR_BASELINE_DATA
    };
}

function createBaseline(newBaseline) {
    return {
        type: types.CREATE_BASELINE,
        payload: api.postNewBaseline(newBaseline)
    };
}

function patchBaseline(baselineId, apiBody) {
    return {
        type: types.PATCH_BASELINE,
        payload: api.patchBaselineData(baselineId, apiBody)
    };
}

function setIdDelete(baselineUUID) {
    return {
        type: types.SET_ID_DELETE,
        payload: baselineUUID
    };
}

function deleteBaseline(baselineId) {
    return {
        type: types.DELETE_BASELINE,
        payload: api.deleteBaselineData(baselineId)
    };
}

function expandRow(factName) {
    return {
        type: types.EXPAND_ROW,
        payload: factName
    };
}

export default {
    fetchBaselines,
    selectBaseline,
    setSelectedBaselines,
    clearSelectedBaselines,
    fetchBaselineData,
    addBaselineUUID,
    clearBaselineData,
    createBaseline,
    patchBaseline,
    setIdDelete,
    deleteBaseline,
    expandRow
};
