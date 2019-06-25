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

function setSelectedBaselineIds(baselineIds) {
    return {
        type: types.SET_SELECTED_BASELINE_IDS,
        payload: baselineIds
    };
}

export default {
    fetchBaselines,
    selectBaseline,
    setSelectedBaselineIds
};
