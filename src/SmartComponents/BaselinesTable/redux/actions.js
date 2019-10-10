import types from './types';
import api from '../../../api';

function fetchBaselines(params = {}) {
    return {
        type: types.FETCH_BASELINE_LIST,
        payload: api.getBaselineList(params)
    };
}

function selectBaseline(ids, isSelected) {
    return {
        type: types.SELECT_BASELINE,
        payload: { ids, isSelected }
    };
}

function selectOneBaseline(id, isSelected) {
    return {
        type: types.SELECT_ONE_BASELINE,
        payload: { id, isSelected }
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

function clearBaselineData() {
    return {
        type: types.CLEAR_BASELINE_DATA
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
        type: types.EXPAND_PARENT_FACT,
        payload: factName
    };
}

export default {
    fetchBaselines,
    selectBaseline,
    selectOneBaseline,
    setSelectedBaselines,
    clearSelectedBaselines,
    fetchBaselineData,
    clearBaselineData,
    patchBaseline,
    setIdDelete,
    deleteBaseline,
    expandRow
};
