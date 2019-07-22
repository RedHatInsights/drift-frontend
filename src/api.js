import axios from 'axios';
import { DRIFT_API_ROOT, BASELINE_API_ROOT } from './constants';

async function post(path, body = {}) {
    const request = await axios.post(DRIFT_API_ROOT.concat(path), body);
    return request.data;
}

async function getBaselines(path, body = {}) {
    const request = await axios.get(BASELINE_API_ROOT.concat(path), body);
    return request.data.data;
}

function getCompare(systemIds = [], baselineIds = []) {
    if (!Array.isArray(systemIds)) {
        systemIds = [ systemIds ];
    }

    if (!Array.isArray(baselineIds)) {
        baselineIds = [ baselineIds ];
    }

    /*eslint-disable camelcase*/
    return post('/comparison_report', { system_ids: systemIds, baseline_ids: baselineIds });
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
