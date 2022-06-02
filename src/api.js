/*eslint-disable camelcase*/
import axios from 'axios';
import { DRIFT_API_ROOT, BASELINE_API_ROOT, HISTORICAL_PROFILES_API_ROOT, INVENTORY_API_ROOT } from './constants';

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
    return request.data.data[0];
}

async function getNotificationSystems(path) {
    const request = await axios.get(BASELINE_API_ROOT.concat(path));
    return request.data.system_ids;
}

async function postSystemNotifications(path, body = {}) {
    const request = await axios.post(BASELINE_API_ROOT.concat(path), body);
    return request.data;
}

async function patchBaseline(path, body = {}) {
    let request = await axios.patch(BASELINE_API_ROOT.concat(path), body);

    return request;
}

async function postBaseline(path, body = {}) {
    const request = await axios.post(BASELINE_API_ROOT.concat(path), body);
    return request.data;
}

async function deleteBaselines(path, body = {}) {
    let response = await axios.post(BASELINE_API_ROOT.concat(path), body);

    return response;
}

async function getHistoricalData(path) {
    let response;

    const request = await axios.get(HISTORICAL_PROFILES_API_ROOT.concat(path))
    .catch(function (error) {
        return error.response;
    });

    if (request.status === 200) {
        response = request.data.data[0];
    } else {
        response = request;
    }

    return response;
}

async function getSystems(path) {
    const request = await axios.get(INVENTORY_API_ROOT.concat(path));
    return request;
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

    return post('/comparison_report', {
        system_ids: systemIds,
        baseline_ids: baselineIds,
        historical_system_profile_ids: historicalSystemProfileIds,
        reference_id: referenceId
    });
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

function getBaselineNotification(baselineId) {
    let path = `/baselines/${baselineId}/systems`;
    return getNotificationSystems(path);
}

function addSystemNotification(baselineId, systems) {
    let path = `/baselines/${baselineId}/systems`;
    let body = { system_ids: systems };

    return postSystemNotifications(path, body);
}

function deleteSystemNotifications(baselineId, systems) {
    let path = `/baselines/${baselineId}/systems/deletion_request`;
    let body = { system_ids: systems };

    return postSystemNotifications(path, body);
}

async function buildBatchRequests(page, totalSystems) {
    let path = `/hosts?per_page=100&page=${page}&order_by=updated&order_how=DESC&staleness=fresh&staleness=stale`;
    let systems = await getSystems(path);
    let systemIds = systems.data.results.map(system => system.id);
    systemIds.forEach(systemId => totalSystems.push(systemId));
}

async function systemFetch(count) {
    let totalSystems = [];
    let batchRequests = [];
    for (let i = 1; Math.ceil(count / 100) >= i; i++) {
        batchRequests.push(
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve(buildBatchRequests(i, totalSystems));
                }, 100);
            })
        );

    }

    await Promise.all(batchRequests);
    return totalSystems;
}

export default {
    getCompare,
    getBaselineList,
    getBaselineData,
    patchBaselineData,
    deleteBaselinesData,
    postNewBaseline,
    fetchHistoricalData,
    getBaselineNotification,
    addSystemNotification,
    deleteSystemNotifications,
    systemFetch
};
/*eslint-enable camelcase*/
