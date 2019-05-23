import queryString from 'query-string';

export function setHistory(history, systemIds) {
    /*eslint-disable camelcase*/
    history.push({
        search: '?' + queryString.stringify({ system_ids: systemIds })
    });
    /*eslint-enable camelcase*/
}
