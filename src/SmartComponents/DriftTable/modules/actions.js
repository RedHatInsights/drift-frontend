import types from './types';
import api from '../../../api';

function fetchStatus() {
    return {
        type: types.FETCH_STATUS,
        payload: api.getStatus()
    };
}

function fetchCompare(hostIds) {
    return {
        type: types.FETCH_COMPARE,
        payload: api.getCompare(hostIds)
    };
}

export default {
    fetchStatus,
    fetchCompare
};
