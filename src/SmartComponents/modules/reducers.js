import types from './types';

const initialState = {
    fullCompareData: [],
    filteredCompareData: [],
    sortedFilteredFacts: [],
    systems: [],
    addSystemModalOpened: false,
    selectedSystemIds: [],
    filterDropdownOpened: false,
    stateFilter: 'all',
    factFilter: '',
    totalFacts: 0,
    page: 1,
    sort: 'asc',
    perPage: 10,
    loading: false
};

function paginateData(data, selectedPage, factsPerPage) {
    let paginatedFacts = [];

    for (let i = 0; i < data.length; i++) {
        if (Math.ceil((i + 1) / factsPerPage) === selectedPage) {
            paginatedFacts.push(data[i]);
        }
    }

    return paginatedFacts;
}

function filterCompareData(data, stateFilter, factFilter) {
    let filteredFacts = [];

    for (let i = 0; i < data.length; i += 1) {
        if (data[i].name.includes(factFilter)) {
            if (stateFilter.toLowerCase() === 'all' || stateFilter === undefined) {
                filteredFacts.push(data[i]);
            }
            else if (stateFilter === data[i].state) {
                filteredFacts.push(data[i]);
            }
        }
    }

    return filteredFacts;
}

function sortData(filteredFacts, sort) {
    if (sort === 'asc') {
        filteredFacts.sort(function(a, b) {
            if (a.name > b.name) {
                return 1;
            }
            else if (a.name < b.name) {
                return -1;
            }
            else {
                return 0;
            }
        });
    }
    else if (sort === 'desc') {
        filteredFacts.sort(function(a, b) {
            if (b.name > a.name) {
                return 1;
            }
            else if (b.name < a.name) {
                return -1;
            }
            else {
                return 0;
            }
        });
    }

    return filteredFacts;
}

function selectedSystems(selectedIds, selectedSystem) {
    let id = selectedSystem.id;

    if (selectedSystem.selected && !selectedIds.includes(id)) {
        selectedIds.push(id);
    } else if (!selectedSystem.selected) {
        selectedIds = selectedIds.filter(item => item !== id);
    }

    return selectedIds;
}

function convertFactsToCSV(data, systems) {
    if (data === null || !data.length) {
        return null;
    }

    let columnDelimiter = data.columnDelimiter || ',';
    let lineDelimiter = data.lineDelimiter || '\n';

    let systemNames = systems.map(system => system.fqdn);

    let headers = 'Fact,State,';
    systemNames = systemNames.join(columnDelimiter);
    let result = headers + systemNames + lineDelimiter;

    let keys = Object.keys(data[0]);

    data.forEach(function(fact) {
        keys.forEach(function(key, index) {
            if (index > 0) {
                result += columnDelimiter;
            }

            if (key === 'systems') {
                fact[key].forEach(function(system) {
                    let value = system.value.replace(/,/g, '');
                    result += value;
                    result += columnDelimiter;
                });
                result += lineDelimiter;
            } else {
                result += fact[key];
            }
        });
    });

    return result;
}

function downloadCSV(driftData, systems) {
    let csv = convertFactsToCSV(driftData, systems);

    if (csv === null) {
        return;
    }

    let filename = 'system-comparison-export-';
    let today = new Date();
    filename += today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    filename += '_';
    filename += today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    filename += '.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }

    let data = encodeURI(csv);

    let link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.dispatchEvent(new MouseEvent(`click`, { bubbles: true, cancelable: true, view: window }));
}

function compareReducer(state = initialState, action) {
    let filteredFacts;
    let sortedFacts;
    let paginatedFacts;
    let systemIds;

    switch (action.type) {
        case types.CLEAR_STATE:
            return {
                ...initialState
            };
        case `${types.FETCH_COMPARE}_PENDING`:
            return {
                ...state,
                filteredCompareData: [],
                systems: [],
                loading: true
            };
        case `${types.FETCH_COMPARE}_FULFILLED`:
            filteredFacts = filterCompareData(action.payload.facts, state.stateFilter, state.factFilter);
            sortedFacts = sortData(filteredFacts, state.sort);
            paginatedFacts = paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                loading: false,
                fullCompareData: action.payload.facts,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                systems: action.payload.systems,
                selectedSystemIds: action.payload.systems.map(system => system.id),
                page: 1,
                totalFacts: filteredFacts.length
            };
        case types.SELECT_ENTITY:
            return {
                ...state,
                selectedSystemIds: selectedSystems([ ...state.selectedSystemIds ], action.payload)
            };
        case `${types.UPDATE_PAGINATION}`:
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilter, state.factFilter);
            sortedFacts = sortData(filteredFacts, state.sort);
            paginatedFacts = paginateData(sortedFacts, action.payload.page, action.payload.perPage);
            return {
                ...state,
                page: action.payload.page,
                perPage: action.payload.perPage,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.FILTER_BY_STATE}`:
            filteredFacts = filterCompareData(state.fullCompareData, action.payload, state.factFilter);
            sortedFacts = sortData(filteredFacts, state.sort);
            paginatedFacts = paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                stateFilter: action.payload,
                page: 1,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.FILTER_BY_FACT}`:
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilter, action.payload);
            sortedFacts = sortData(filteredFacts, state.sort);
            paginatedFacts = paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                factFilter: action.payload,
                page: 1,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.TOGGLE_FACT_SORT}`:
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilter, state.factFilter);
            sortedFacts = sortData(filteredFacts, action.payload);
            paginatedFacts = paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                page: 1,
                sort: action.payload,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.EXPORT_TO_CSV}`:
            downloadCSV(state.sortedFilteredFacts, state.systems);
            return {
                ...state
            };
        case `${types.RESET_SELECTED_SYSTEM_IDS}`:
            systemIds = state.systems.map(system => system.id);
            return {
                ...state,
                selectedSystemIds: systemIds
            };

        default:
            return {
                ...state
            };
    }
}

function addSystemModalReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.OPEN_ADD_SYSTEM_MODAL}`:
            return {
                ...state,
                addSystemModalOpened: !state.addSystemModalOpened
            };

        default:
            return {
                ...state
            };
    }
}

function filterDropdownReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.OPEN_FILTER_DROPDOWN}`:
            return {
                ...state,
                filterDropdownOpened: !state.filterDropdownOpened
            };

        default:
            return {
                ...state
            };
    }
}

export default {
    compareReducer,
    addSystemModalReducer,
    filterDropdownReducer
};
