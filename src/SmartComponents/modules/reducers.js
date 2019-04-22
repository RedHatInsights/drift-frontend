import types from './types';

const initialState = {
    fullCompareData: [],
    filteredCompareData: [],
    sortedFilteredFacts: [],
    systems: [],
    previousStateSystems: [],
    addSystemModalOpened: false,
    selectedSystemIds: [],
    filterDropdownOpened: false,
    stateFilter: 'all',
    factFilter: '',
    totalFacts: 0,
    page: 1,
    sort: 'asc',
    perPage: 10,
    loading: false,
    expandedRows: [],
    kebabOpened: false,
    error: {},
    errorAlertOpened: false
};

function paginateData(data, selectedPage, factsPerPage) {
    let paginatedFacts = [];

    if (data === null || !data.length) {
        return [];
    }

    for (let i = 0; i < data.length; i++) {
        if (Math.ceil((i + 1) / factsPerPage) === selectedPage) {
            paginatedFacts.push(data[i]);
        }
    }

    return paginatedFacts;
}

function filterCompareData(data, stateFilter, factFilter, newExpandedRows) {
    let filteredFacts = [];
    let filteredComparisons = [];

    if (data === null || !data.length) {
        return [];
    }

    for (let i = 0; i < data.length; i += 1) {
        if (data[i].comparisons) {
            filteredComparisons = filterComparisons(data[i].comparisons, stateFilter, factFilter);

            if (filteredComparisons.length) {
                if (newExpandedRows.includes(data[i].name)) {
                    filteredFacts.push({ name: data[i].name, state: data[i].state, comparisons: filteredComparisons });
                } else {
                    filteredFacts.push({ name: data[i].name, state: data[i].state, comparisons: []});
                }
            }
        } else {
            if (data[i].name.includes(factFilter)) {
                if (stateFilter.toLowerCase() === 'all' || stateFilter === undefined) {
                    filteredFacts.push(data[i]);
                }
                else if (stateFilter === data[i].state) {
                    filteredFacts.push(data[i]);
                }
            }
        }
    }

    return filteredFacts;
}

function filterComparisons(comparisons, stateFilter, factFilter) {
    let filteredComparisons = [];

    for (let i = 0; i < comparisons.length; i++) {
        if (comparisons[i].name.includes(factFilter)) {
            if (stateFilter.toLowerCase() === 'all' || stateFilter === undefined) {
                filteredComparisons.push(comparisons[i]);
            }
            else if (stateFilter === comparisons[i].state) {
                filteredComparisons.push(comparisons[i]);
            }
        }
    }

    return filteredComparisons;
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

    if (selectedSystem.selected && !selectedIds.includes(id) && id !== 0 && id !== null) {
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

    let systemNames = systems.map(system => system.display_name);

    let headers = 'Fact,State,';
    systemNames = systemNames.join(columnDelimiter);
    let result = headers + systemNames + lineDelimiter;

    let comparisons;

    data.forEach(function(fact) {
        let keys = Object.keys(fact);
        keys.forEach(function(key, index) {
            if (index > 0) {
                result += columnDelimiter;
            }

            if (key === 'systems') {
                fact[key].forEach(function(system) {
                    let value = system.value ? system.value.replace(/,/g, '') : '';
                    result += value;
                    result += columnDelimiter;
                });
                result += lineDelimiter;
            } else if (key === 'comparisons') {
                if (fact.comparisons.length) {
                    result += lineDelimiter;
                    comparisons = fact.comparisons;
                    comparisons.forEach(function(fact) {
                        keys = Object.keys(fact);
                        keys.forEach(function(key, index) {
                            if (index > 0) {
                                result += columnDelimiter;
                            }

                            if (key === 'systems') {
                                fact[key].forEach(function(system) {
                                    let value = system.value ? system.value.replace(/,/g, '') : '';
                                    result += value;
                                    result += columnDelimiter;
                                });
                                result += lineDelimiter;
                            } else {
                                if (key === 'name') {
                                    result += '    ';
                                }

                                result += fact[key];
                            }
                        });
                    });
                } else {
                    result += lineDelimiter;
                }
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

function toggleExpandedRow(expandedRows, factName) {
    if (expandedRows.includes(factName)) {
        expandedRows = expandedRows.filter(fact => fact !== factName);
    } else {
        expandedRows.push(factName);
    }

    return expandedRows;
}

function compareReducer(state = initialState, action) {
    let filteredFacts;
    let sortedFacts;
    let paginatedFacts;
    let systemIds;
    let newExpandedRows;
    let errorObject = {};
    let response;

    switch (action.type) {
        case types.CLEAR_STATE:
            return {
                ...initialState
            };
        case types.REVERT_COMPARE_DATA:
            return {
                ...state,
                loading: false,
                error: {},
                systems: state.previousStateSystems,
                selectedSystemIds: state.systems.map(system => system.id)
            };
        case `${types.FETCH_COMPARE}_PENDING`:
            return {
                ...state,
                previousStateSystems: state.systems,
                systems: [],
                loading: true
            };
        case `${types.FETCH_COMPARE}_FULFILLED`:
            filteredFacts = filterCompareData(action.payload.facts, state.stateFilter, state.factFilter, state.expandedRows);
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
        case `${types.FETCH_COMPARE}_REJECTED`:
            response = action.payload.response;
            if (response.data.message) {
                errorObject = { detail: response.data.message, status: response.status };
            } else {
                errorObject = { detail: response.data.detail, status: response.status };
            }

            return {
                ...state,
                error: errorObject
            };
        case types.SELECT_ENTITY:
            return {
                ...state,
                selectedSystemIds: selectedSystems([ ...state.selectedSystemIds ], action.payload)
            };
        case `${types.UPDATE_PAGINATION}`:
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilter, state.factFilter, state.expandedRows);
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
            filteredFacts = filterCompareData(state.fullCompareData, action.payload, state.factFilter, state.expandedRows);
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
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilter, action.payload, state.expandedRows);
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
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilter, state.factFilter, state.expandedRows);
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
        case `${types.EXPAND_ROW}`:
            newExpandedRows = toggleExpandedRow(state.expandedRows, action.payload);
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilter, state.factFilter, newExpandedRows);
            sortedFacts = sortData(filteredFacts, state.sort);
            paginatedFacts = paginateData(sortedFacts, state.page, state.perPage);
            return {
                ...state,
                expandedRows: newExpandedRows,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
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

function errorAlertReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.OPEN_ERROR_MODAL}`:
            return {
                ...state,
                errorAlertOpened: !state.errorAlertOpened
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

function exportReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.TOGGLE_KEBAB}`:
            return {
                ...state,
                kebabOpened: !state.kebabOpened
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
    errorAlertReducer,
    filterDropdownReducer,
    exportReducer
};
