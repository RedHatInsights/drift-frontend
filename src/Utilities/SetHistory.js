import queryString from 'query-string';
import { ASC, DESC } from '../constants';

export function setHistory(
    history, systemIds = [], baselineIds = [], hspIds = [], referenceId, activeFactFilters = [], factFilter, factTypeFilters, stateFilters, factSort,
    stateSort
) {
    let nameFilters = [ ...activeFactFilters, ...factFilter && !activeFactFilters.includes(factFilter) ? [ factFilter ] : [] ];
    let filterState = stateFilters?.filter(({ selected }) => selected)?.map(({ filter }) => filter?.toLowerCase()) || [];
    let filterFactType = factTypeFilters?.filter(({ selected }) => selected)?.map(({ filter }) => filter?.toLowerCase()) || [];
    let sort = [
        ...[ ASC, DESC ].includes(stateSort) ? [ `${ stateSort === DESC ? '-' : '' }state` ] : [],
        ...[ ASC, DESC ].includes(factSort) ? [ `${ factSort === DESC ? '-' : '' }fact` ] : []
    ];
    let searchPrefix = '?';

    /*eslint-disable camelcase*/
    history.push({
        search: searchPrefix + queryString.stringify({
            system_ids: systemIds,
            baseline_ids: baselineIds,
            hsp_ids: hspIds,
            reference_id: referenceId
        })
    });

    searchPrefix = '&';

    if (!systemIds.length && !baselineIds.length && !hspIds.length && !referenceId) {
        searchPrefix = '';
    }

    history.push({
        search: history.location.search + searchPrefix + queryString.stringify({
            'filter[name]': nameFilters,
            'filter[state]': filterState,
            'filter[show]': filterFactType,
            sort
        }, { arrayFormat: 'comma', encode: false })
    });
    /*eslint-enable camelcase*/
}
