import axios from 'axios';
import { DRIFT_API_ROOT } from './constants';

async function get(path, params = {}) {
    const request = await axios.get(DRIFT_API_ROOT.concat(path), params);
    return request.data;
}

function getCompare(systemIds = []) {
    if (!Array.isArray(systemIds)) {
        systemIds = [ systemIds ];
    }

    /*eslint-disable camelcase*/
    return get('/compare', { params: { system_ids: systemIds }});
    /*eslint-enable camelcase*/
}

function getStatus() {
    return get('/status');
}

export default {
    getCompare,
    getStatus
};
