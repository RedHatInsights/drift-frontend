import queryString from 'query-string';
import { ASC, DESC } from '../constants';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

export const useSetHistory = (
    systemIds = [],
    baselineIds = [],
    hspIds = [],
    referenceId,
    activeFactFilters = [],
    factFilter,
    factTypeFilters,
    stateFilters,
    factSort,
    stateSort
) => {
    const navigate = useInsightsNavigate();
    let nameFilters = [ ...activeFactFilters, ...factFilter && !activeFactFilters.includes(factFilter) ? [ factFilter ] : [] ];
    let filterState = stateFilters?.filter(({ selected }) => selected)?.map(({ filter }) => filter?.toLowerCase()) || [];
    let filterFactType = factTypeFilters?.filter(({ selected }) => selected)?.map(({ filter }) => filter?.toLowerCase()) || [];
    let sort = [
        ...[ ASC, DESC ].includes(stateSort) ? [ `${ stateSort === DESC ? '-' : '' }state` ] : [],
        ...[ ASC, DESC ].includes(factSort) ? [ `${ factSort === DESC ? '-' : '' }fact` ] : []
    ];
    let searchPrefix = '?';

    /*eslint-disable camelcase*/
    let searchString = searchPrefix + queryString.stringify({
        system_ids: systemIds,
        baseline_ids: baselineIds,
        hsp_ids: hspIds,
        reference_id: referenceId
    });

    searchPrefix = '&';

    if (!systemIds.length && !baselineIds.length && !hspIds.length && !referenceId) {
        searchPrefix = '';
    }

    return navigate({
        search: searchString + searchPrefix + queryString.stringify({
            'filter[name]': nameFilters,
            'filter[state]': filterState,
            'filter[show]': filterFactType,
            sort
        }, { arrayFormat: 'comma', encode: false })
    });

};
