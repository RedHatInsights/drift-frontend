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

export default {
    fetchBaselines,
    selectBaseline
};
