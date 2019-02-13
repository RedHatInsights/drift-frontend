import types from './types';
import api from '../../api';

function fetchCompare(systemIds) {
    return {
        type: types.FETCH_COMPARE,
        payload: api.getCompare(systemIds)
    };
}

function toggleAddSystemModal() {
    return {
        type: types.OPEN_ADD_SYSTEM_MODAL
    };
}

function toggleFilterDropDown() {
    return {
        type: types.OPEN_FILTER_DROPDOWN
    };
}

function filterByState(filter) {
    return {
        type: types.FILTER_BY_STATE,
        payload: filter
    };
}

export default {
    fetchCompare,
    toggleAddSystemModal,
    toggleFilterDropDown,
    filterByState
};
