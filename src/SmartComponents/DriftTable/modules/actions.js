import types from './types';
import api from '../../../api';

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

export default {
    fetchStatus,
    fetchCompare
};
