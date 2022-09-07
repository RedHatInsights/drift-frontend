import types from './types';
import api from '../../../../api';
import { getNewNameSort, getNewValueSort } from './helpers';

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
        type: 'csv',
        exportType: 'baselines data',
        exportData: baselineData,
        baselineRowData
    };

    return {
        type: `EXPORT_BASELINE_DATA_TO_CSV`,
        payload: data
    };
}

function exportToJSON(baselineData) {
    let data = {
        type: 'json',
        exportType: 'baselines data',
        exportData: baselineData
    };

    return {
        type: `EXPORT_BASELINE_DATA_TO_JSON`,
        payload: data
    };
}

function resetBaselineDataExportStatus() {
    return {
        type: `RESET_BASELINE_DATA_EXPORT_STATUS`
    };
}

function toggleNotificationPending() {
    return {
        type: `TOGGLE_NOTIFICATIONS_SWITCH_PENDING`
    };
}

function toggleNotificationFulfilled(data) {
    return {
        type: `TOGGLE_NOTIFICATIONS_SWITCH_FULFILLED`,
        payload: data.response
    };
}

function toggleNameSort(currentSort) {
    return {
        type: types.TOGGLE_FACT,
        payload: getNewNameSort(currentSort)
    };
}

function toggleValueSort(currentSort) {
    return {
        type: types.TOGGLE_VALUE,
        payload: getNewValueSort(currentSort)
    };
}

/*eslint-disable camelcase*/
function toggleNotificationRejected(error, id, display_name) {
    return {
        type: `TOGGLE_NOTIFICATIONS_SWITCH_REJECTED`,
        payload: { error, id, display_name }
    };
}
/*eslint-enable camelcase*/

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
    exportToCSV,
    exportToJSON,
    resetBaselineDataExportStatus,
    toggleNotificationPending,
    toggleNotificationFulfilled,
    toggleNotificationRejected,
    toggleValueSort,
    toggleNameSort
};
