import types from './types';
import operations from '../../../api';

function fetchStatus() {
    return {
        type: types.FETCH_STATUS,
        payload: operations.getStatus()
    };
}

function fetchCompare(hostIds) {
    return {
        type: types.FETCH_COMPARE,
        payload: operations.getCompare(hostIds)
    };
}

export default {
    fetchStatus,
    fetchCompare
};
