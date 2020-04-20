import axios from 'axios';
import { DRIFT_API_ROOT, BASELINE_API_ROOT, HISTORICAL_PROFILES_API_ROOT } from './constants';

async function post(path, body = {}) {
    const request = await axios.post(DRIFT_API_ROOT.concat(path), body);
    return request.data;
}

async function getBaselines(path, getParams = {}) {
    const request = await axios.get(BASELINE_API_ROOT.concat(path), { params: getParams });
    return request.data;
}

async function getBaseline(path) {
    const request = await axios.get(BASELINE_API_ROOT.concat(path));

    if (request.data.data.length === 0) {
        return request.data.data;
    } else {
        return request.data.data[0];
    }
}

async function patchBaseline(path, body = {}) {
    const request = await axios.patch(BASELINE_API_ROOT.concat(path), body);
    return request.data[0];
}

async function postBaseline(path, body = {}) {
    const request = await axios.post(BASELINE_API_ROOT.concat(path), body);
    return request.data;
}

async function deleteBaselines(path, body = {}) {
    return await axios.post(BASELINE_API_ROOT.concat(path), body);
}

async function getHistoricalData(path) {
    const request = await axios.get(HISTORICAL_PROFILES_API_ROOT.concat(path));
    return request.data.data[0];
}

function getCompare(systemIds = [], baselineIds = [], historicalSystemProfileIds = [], referenceId = '') {
    if (!Array.isArray(systemIds)) {
        systemIds = [ systemIds ];
    }

    if (!Array.isArray(baselineIds)) {
        baselineIds = [ baselineIds ];
    }

    if (!Array.isArray(historicalSystemProfileIds)) {
        historicalSystemProfileIds = [ historicalSystemProfileIds ];
    }

    /*eslint-disable camelcase*/
    return post('/comparison_report', {
        system_ids: systemIds,
        baseline_ids: baselineIds,
        historical_system_profile_ids: historicalSystemProfileIds,
        reference_id: referenceId
    });
    /*eslint-enable camelcase*/
}

function getBaselineList(params = {}) {
    return getBaselines('/baselines', params);
}

function getBaselineData(baselineId = []) {
    let path = '/baselines/';

    return getBaseline(path.concat(baselineId), {});
}

function patchBaselineData(baselineId = [], apiBody) {
    let path = '/baselines/';

    return patchBaseline(path.concat(baselineId), apiBody);
}

function deleteBaselinesData(deleteBaselinesAPIBody = []) {
    let path = '/baselines/deletion_request';

    return deleteBaselines(path, deleteBaselinesAPIBody);
}

function postNewBaseline(apiBody, uuid) {
    let path = '/baselines';
    if (uuid !== undefined) {
        let newPath = path.concat('/', uuid, '?', 'display_name=', apiBody.display_name);
        return postBaseline(newPath, {});
    }

    return postBaseline(path, apiBody);
}

function fetchHistoricalData(systemId) {
    let path = '/systems/';
    return getHistoricalData(path.concat(systemId));
}

export default {
    getCompare,
    getBaselineList,
    getBaselineData,
    patchBaselineData,
    deleteBaselinesData,
    postNewBaseline,
    fetchHistoricalData
};
