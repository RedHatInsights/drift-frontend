import api from '../../../api';

function fetchBaselines(tableId, params = {}) {
    return {
        type: `FETCH_BASELINE_LIST_${ tableId }`,
        payload: api.getBaselineList(params)
    };
}

function revertBaselineFetch(tableId) {
    return {
        type: `REVERT_BASELINE_FETCH_${tableId}`
    };
}

function selectBaseline(ids, isSelected, tableId) {
    return {
        type: `SELECT_BASELINE_${tableId}`,
        payload: { ids, isSelected }
    };
}

function setSelectedBaselines(selectedBaselineIds, tableId) {
    return {
        type: `SET_SELECTED_BASELINES_${tableId}`,
        payload: selectedBaselineIds
    };
}

function clearSelectedBaselines(tableId) {
    return {
        type: `CLEAR_SELECTED_BASELINES_${tableId}`
    };
}

function clearBaselineData(tableId) {
    return {
        type: `CLEAR_BASELINE_DATA_${tableId}`
    };
}

function deleteSelectedBaselines(deleteBaselinesAPIBody, tableId) {
    return {
        type: `DELETE_SELECTED_BASELINES_${tableId}`,
        payload: api.deleteBaselinesData(deleteBaselinesAPIBody)
    };
}

function exportToCSV(tableId, baselineData) {
    let data = {
        type: 'csv',
        exportType: 'baseline list',
        exportData: baselineData
    };

    return {
        type: `EXPORT_BASELINES_LIST_TO_CSV_${tableId}`,
        payload: data
    };
}

function exportToJSON(tableId, baselineData) {
    let data = {
        type: 'json',
        exportType: 'baseline list',
        exportData: baselineData
    };

    return {
        type: `EXPORT_BASELINES_LIST_TO_JSON_${tableId}`,
        payload: data
    };
}

function resetBaselinesExportStatus() {
    return {
        type: `RESET_BASELINES_EXPORT_STATUS_CHECKBOX`
    };
}

export default {
    fetchBaselines,
    revertBaselineFetch,
    selectBaseline,
    setSelectedBaselines,
    clearSelectedBaselines,
    clearBaselineData,
    deleteSelectedBaselines,
    exportToCSV,
    exportToJSON,
    resetBaselinesExportStatus
};
