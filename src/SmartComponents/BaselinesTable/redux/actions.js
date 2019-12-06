import types from './types';
import api from '../../../api';

function fetchBaselines(params = {}, isModal) {
    return {
        type: types.FETCH_BASELINE_LIST,
        payload: api.getBaselineList(params, isModal)
    };
}

function selectBaseline(ids, isSelected) {
    return {
        type: types.SELECT_BASELINE,
        payload: { ids, isSelected }
    };
}

function selectOneBaseline(id) {
    return {
        type: types.SELECT_ONE_BASELINE,
        payload: id
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

function deleteSelectedBaselines(deleteBaselinesAPIBody) {
    return {
        type: types.DELETE_SELECTED_BASELINES,
        payload: api.deleteBaselinesData(deleteBaselinesAPIBody)
    };
}

export default {
    fetchBaselines,
    selectBaseline,
    selectOneBaseline,
    setSelectedBaselines,
    clearSelectedBaselines,
    deleteSelectedBaselines
};
