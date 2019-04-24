import types from './types';
import { ASC, DESC } from '../../constants';

const initialState = {
    fullCompareData: [],
    filteredCompareData: [],
    sortedFilteredFacts: [],
    systems: [],
    previousStateSystems: [],
    addSystemModalOpened: false,
    filterDropdownOpened: false,
    stateFilters: [
        { filter: 'SAME', display: 'Same', selected: true },
        { filter: 'DIFFERENT', display: 'Different', selected: true },
        { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
    ],
    factFilter: '',
    totalFacts: 0,
    page: 1,
    factSort: ASC,
    stateSort: '',
    perPage: 10,
    loading: false,
    expandedRows: [],
    kebabOpened: false,
    error: {},
    errorAlertOpened: false,
    activeSort: 'fact'
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

function getStateSelected(state, stateFilters) {
    let isStateSelected;

    isStateSelected = stateFilters.find(function(stateFilter) {
        if (stateFilter.filter === state) {
            return stateFilter.selected;
        }
    });

    return isStateSelected;
}

function filterCompareData(data, stateFilters, factFilter, newExpandedRows) {
    let filteredFacts = [];
    let filteredComparisons = [];
    let isStateSelected;

    if (data === null || !data.length) {
        return [];
    }

    for (let i = 0; i < data.length; i += 1) {
        isStateSelected = getStateSelected(data[i].state, stateFilters);

        if (data[i].comparisons) {
            if (data[i].name === factFilter) {
                if (newExpandedRows.includes(data[i].name) && isStateSelected) {
                    filteredFacts.push({ name: data[i].name, state: data[i].state, comparisons: data[i].comparisons });
                } else {
                    filteredFacts.push({ name: data[i].name, state: data[i].state, comparisons: []});
                }

                break;
            }

            filteredComparisons = filterComparisons(data[i].comparisons, stateFilters, factFilter);

            if (filteredComparisons.length) {
                if (newExpandedRows.includes(data[i].name)) {
                    filteredFacts.push({ name: data[i].name, state: data[i].state, comparisons: filteredComparisons });
                } else {
                    filteredFacts.push({ name: data[i].name, state: data[i].state, comparisons: []});
                }
            }
        } else {
            if (data[i].name.includes(factFilter)) {
                if (isStateSelected) {
                    filteredFacts.push(data[i]);
                }
            }
        }
    }

    return filteredFacts;
}

function filterComparisons(comparisons, stateFilters, factFilter) {
    let filteredComparisons = [];
    let isStateSelected;

    for (let i = 0; i < comparisons.length; i++) {
        isStateSelected = getStateSelected(comparisons[i].state, stateFilters);

        if (comparisons[i].name.includes(factFilter)) {
            if (isStateSelected) {
                filteredComparisons.push(comparisons[i]);
            }
        }
    }

    return filteredComparisons;
}

function sortData(filteredFacts, factSort, stateSort) {
    if (stateSort === ASC) {
        filteredFacts.sort(function(a, b) {
            if (a.state.toLowerCase() > b.state.toLowerCase()) {
                return -1;
            }
            else if (a.state.toLowerCase() < b.state.toLowerCase()) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }

    if (stateSort === DESC) {
        filteredFacts.sort(function(a, b) {
            if (b.state.toLowerCase() > a.state.toLowerCase()) {
                return -1;
            }
            else if (b.state.toLowerCase() < a.state.toLowerCase()) {
                return 1;
            }
            else {
                return 0;
            }
        });
    }

    if (factSort === ASC) {
        filteredFacts.sort(function(a, b) {
            if (stateSort === '') {
                if (a.name > b.name) {
                    return 1;
                }
                else if (a.name < b.name) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            else {
                if ((a.name > b.name) && (a.state === b.state)) {
                    return 1;
                }
                else if ((a.name < b.name) && (a.state === b.state)) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
        });
    }
    else if (factSort === DESC) {
        filteredFacts.sort(function(a, b) {
            if (stateSort === '') {
                if (b.name > a.name) {
                    return 1;
                }
                else if (b.name < a.name) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            else {
                if ((b.name > a.name) && (a.state === b.state)) {
                    return 1;
                }
                else if ((b.name < a.name) && (a.state === b.state)) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
        });
    }

    return filteredFacts;
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

function updateStateFilters(stateFilters, updatedStateFilter) {
    let newStateFilters = [];

    stateFilters.forEach(function (stateFilter) {
        if (stateFilter.filter === updatedStateFilter.filter) {
            newStateFilters.push(updatedStateFilter);
        } else {
            newStateFilters.push(stateFilter);
        }
    });

    return newStateFilters;
}

function compareReducer(state = initialState, action) {
    let filteredFacts;
    let sortedFacts;
    let paginatedFacts;
    let newExpandedRows;
    let errorObject = {};
    let response;
    let updatedStateFilters = [];

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
                systems: state.previousStateSystems
            };
        case `${types.FETCH_COMPARE}_PENDING`:
            return {
                ...state,
                previousStateSystems: state.systems,
                systems: [],
                loading: true
            };
        case `${types.FETCH_COMPARE}_FULFILLED`:
            filteredFacts = filterCompareData(action.payload.facts, state.stateFilters, state.factFilter, state.expandedRows);
            sortedFacts = sortData(filteredFacts, state.factSort, state.stateSort);
            paginatedFacts = paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                loading: false,
                fullCompareData: action.payload.facts,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                systems: action.payload.systems,
                page: 1,
                totalFacts: filteredFacts.length
            };
        case `${types.FETCH_COMPARE}_REJECTED`:
            response = action.payload.response;
            if (response.data === '') {
                errorObject = { detail: response.statusText, status: response.status };
            } else if (response.data.message) {
                errorObject = { detail: response.data.message, status: response.status };
            } else {
                errorObject = { detail: response.data.detail, status: response.status };
            }

            return {
                ...state,
                error: errorObject
            };
        case `${types.UPDATE_PAGINATION}`:
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilters, state.factFilter, state.expandedRows);
            sortedFacts = sortData(filteredFacts, state.factSort, state.stateSort);
            paginatedFacts = paginateData(sortedFacts, action.payload.page, action.payload.perPage);
            return {
                ...state,
                page: action.payload.page,
                perPage: action.payload.perPage,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.ADD_STATE_FILTER}`:
            updatedStateFilters = updateStateFilters(state.stateFilters, action.payload);
            filteredFacts = filterCompareData(state.fullCompareData, updatedStateFilters, state.factFilter, state.expandedRows);
            sortedFacts = sortData(filteredFacts, state.factSort, state.stateSort);
            paginatedFacts = paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                stateFilters: updatedStateFilters,
                page: 1,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.FILTER_BY_FACT}`:
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilters, action.payload, state.expandedRows);
            sortedFacts = sortData(filteredFacts, state.factSort, state.stateSort);
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
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilters, state.factFilter, state.expandedRows);
            sortedFacts = sortData(filteredFacts, action.payload, state.stateSort);
            paginatedFacts = paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                page: 1,
                factSort: action.payload,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.TOGGLE_STATE_SORT}`:
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilters, state.factFilter, state.expandedRows);
            sortedFacts = sortData(filteredFacts, state.factSort, action.payload);
            paginatedFacts = paginateData(sortedFacts, 1, state.perPage);
            return {
                ...state,
                page: 1,
                stateSort: action.payload,
                filteredCompareData: paginatedFacts,
                sortedFilteredFacts: sortedFacts,
                totalFacts: filteredFacts.length
            };
        case `${types.EXPORT_TO_CSV}`:
            downloadCSV(state.sortedFilteredFacts, state.systems);
            return {
                ...state
            };
        case `${types.EXPAND_ROW}`:
            newExpandedRows = toggleExpandedRow(state.expandedRows, action.payload);
            filteredFacts = filterCompareData(state.fullCompareData, state.stateFilters, state.factFilter, newExpandedRows);
            sortedFacts = sortData(filteredFacts, state.factSort, state.stateSort);
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

function activeSortReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.TOGGLE_ACTIVE_SORT}`:
            return {
                ...state,
                activeSort: action.payload
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
    exportReducer,
    activeSortReducer
};
