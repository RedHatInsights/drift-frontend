import types from './types';
import operations from '../../../api';

function fetchStatus() {
    return {
        type: types.FETCH_STATUS,
        payload: operations.getStatus()
    };
}

function fetchCompare() {
    return {
        type: types.FETCH_COMPARE,
        payload: operations.getCompare()
    };
}

export default {
    fetchStatus,
    fetchCompare
};
