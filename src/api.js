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
    return get('/comparison_report', { params: { system_ids: systemIds }});
    /*eslint-enable camelcase*/
}

export default {
    getCompare
};
