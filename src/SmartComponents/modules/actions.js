import types from './types';
import api from '../../api';

function fetchStatus() {
    return {
        type: types.FETCH_STATUS,
        payload: api.getStatus()
    };
}

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

export default {
    fetchStatus,
    fetchCompare,
    toggleAddSystemModal
};
