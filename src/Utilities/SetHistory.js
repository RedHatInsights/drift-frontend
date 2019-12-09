import queryString from 'query-string';

export function setHistory(history, systemIds = [], baselineIds = [], pitIds = []) {
    /*eslint-disable camelcase*/
    history.push({
        search: '?' + queryString.stringify({ system_ids: systemIds, baseline_ids: baselineIds, pit_ids: pitIds })
    });
    /*eslint-enable camelcase*/
}
