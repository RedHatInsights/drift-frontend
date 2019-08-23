import types from './types';

function exportToCSV(exportType, baselineData, baselineRowData = []) {
    let data = {
        exportType,
        exportData: baselineData,
        baselineRowData
    };

    return {
        type: types.EXPORT_BASELINES_LIST_TO_CSV,
        payload: data
    };
}

export default {
    exportToCSV
};
