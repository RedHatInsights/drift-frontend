import queryString from 'query-string';

export function setHistory(history, systemIds = [], baselineIds = []) {
    /*eslint-disable camelcase*/
    history.push({
        search: '?' + queryString.stringify({ system_ids: systemIds, baseline_ids: baselineIds })
    });
    /*eslint-enable camelcase*/
}
