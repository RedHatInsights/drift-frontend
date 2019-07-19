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

export default {
    fetchBaselines,
    selectBaseline,
    setSelectedBaselines,
    fetchBaselineData,
    clearBaselineData
};
