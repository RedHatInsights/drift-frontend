import types from './types';

function exportToCSV(baselineTableData) {
    return {
        type: types.EXPORT_BASELINES_LIST_TO_CSV,
        payload: baselineTableData
    };
}

export default {
    exportToCSV
};
