import axios from 'axios';
import { DRIFT_API_ROOT, BASELINE_API_ROOT } from './constants';

async function post(path, body = {}) {
    const request = await axios.post(DRIFT_API_ROOT.concat(path), body);
    return request.data;
}

async function getBaselines(path, body = {}) {
    const request = await axios.get(BASELINE_API_ROOT.concat(path), body);
    return request.data;
}

function getCompare(systemIds = []) {
    if (!Array.isArray(systemIds)) {
        systemIds = [ systemIds ];
    }

    /*eslint-disable camelcase*/
    return post('/comparison_report', { system_ids: systemIds });
    /*eslint-enable camelcase*/
}

function getBaselineList() {
    /*eslint-disable camelcase*/
    return getBaselines('/baselines', {});
    /*eslint-enable camelcase*/
}

export default {
    getCompare,
    getBaselineList
};
