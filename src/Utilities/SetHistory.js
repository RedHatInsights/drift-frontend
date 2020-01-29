import queryString from 'query-string';

export function setHistory(history, systemIds = [], baselineIds = [], hspIds = []) {
    /*eslint-disable camelcase*/
    history.push({
        search: '?' + queryString.stringify({ system_ids: systemIds, baseline_ids: baselineIds, hsp_ids: hspIds })
    });
    /*eslint-enable camelcase*/
}
