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

function clearEditBaselineData() {
    return {
        type: types.CLEAR_EDIT_BASELINE_DATA
    };
}

function patchBaseline(baselineId, apiBody) {
    return {
        type: types.PATCH_BASELINE,
        payload: api.patchBaselineData(baselineId, apiBody)
    };
}

function deleteBaselineData(baselineId, apiBody) {
    return {
        type: types.DELETE_BASELINE_DATA,
        payload: api.patchBaselineData(baselineId, apiBody)
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

function clearErrorData() {
    return {
        type: types.CLEAR_ERROR_DATA
    };
}

function exportToCSV(baselineData, baselineRowData = []) {
    let data = {
        exportType: 'baselines data',
        exportData: baselineData,
        baselineRowData
    };

    return {
        type: `EXPORT_BASELINE_DATA_TO_CSV`,
        payload: data
    };
}

export default {
    expandRow,
    fetchBaselineData,
    clearEditBaselineData,
    patchBaseline,
    deleteBaselineData,
    setFactData,
    toggleFactModal,
    selectFact,
    clearErrorData,
    exportToCSV
};
