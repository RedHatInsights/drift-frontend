import { ASC, DESC } from '../../constants';
import moment from 'moment';

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

function getState(state, stateFilters) {
    let isStateSelected;

    isStateSelected = stateFilters.find(function(stateFilter) {
        if (stateFilter.filter === state) {
            return stateFilter;
        }
    });

    return isStateSelected;
}

function setTooltip (data, stateFilters, referenceId) {
    let type = data.comparisons ? 'category' : 'row';
    let state = getState(data.state, stateFilters);

    if (data.state === 'SAME') {
        data.tooltip = state.display +
        ' - ' +
        'All system facts in this ' + type + ' are the same.';
    } else if (data.state === 'INCOMPLETE_DATA') {
        data.tooltip = state.display +
        ' - ' +
        'At least one system fact value in this ' + type + ' is missing.';
    } else {
        if (referenceId) {
            data.tooltip = state.display +
            ' - ' +
            'At least one system fact value in this ' + type + ' differs from the reference.';
        } else {
            data.tooltip = state.display +
            ' - ' +
            'At least one system fact value in this ' + type + ' differs.';
        }
    }
}

function filterCompareData(data, stateFilters, factFilter, referenceId) {
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
                setTooltip(data[i], stateFilters, referenceId);
                filteredComparisons = filterComparisons(data[i].comparisons, stateFilters, '', referenceId);
                filteredFacts.push({
                    name: data[i].name,
                    state: data[i].state,
                    comparisons: filteredComparisons,
                    tooltip: data[i].tooltip
                });

                break;
            }

            filteredComparisons = filterComparisons(data[i].comparisons, stateFilters, factFilter, referenceId);

            if (filteredComparisons.length) {
                setTooltip(data[i], stateFilters, referenceId);
                filteredFacts.push({
                    name: data[i].name,
                    state: data[i].state,
                    comparisons: filteredComparisons,
                    tooltip: data[i].tooltip
                });
            }
        } else {
            if (data[i].name.includes(factFilter)) {
                if (isStateSelected) {
                    setTooltip(data[i], stateFilters, referenceId);
                    filteredFacts.push(data[i]);
                }
            }
        }
    }

    return filteredFacts;
}

function filterComparisons(comparisons, stateFilters, factFilter, referenceId) {
    let filteredComparisons = [];
    let isStateSelected;

    for (let i = 0; i < comparisons.length; i++) {
        isStateSelected = getStateSelected(comparisons[i].state, stateFilters);

        if (comparisons[i].name.includes(factFilter)) {
            if (isStateSelected) {
                setTooltip(comparisons[i], stateFilters, referenceId);
                filteredComparisons.push(comparisons[i]);
            }
        }
    }

    return filteredComparisons;
}

function sortData(filteredFacts, factSort, stateSort) {
    let filteredSubfacts;
    let newFilteredFacts;

    newFilteredFacts = sortFacts(filteredFacts, factSort, stateSort);

    newFilteredFacts.forEach(function(fact) {
        if (fact.comparisons !== undefined && fact.comparisons.length > 0) {
            filteredSubfacts = sortFacts(fact.comparisons, factSort, stateSort);
            fact.comparisons = filteredSubfacts;
        }
    });

    return newFilteredFacts;
}

function sortFacts(filteredFacts, factSort, stateSort) {
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
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                }
                else if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            else {
                if ((a.name.toLowerCase() > b.name.toLowerCase()) && (a.state === b.state)) {
                    return 1;
                }
                else if ((a.name.toLowerCase() < b.name.toLowerCase()) && (a.state === b.state)) {
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
                if (b.name.toLowerCase() > a.name.toLowerCase()) {
                    return 1;
                }
                else if (b.name.toLowerCase() < a.name.toLowerCase()) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            else {
                if ((b.name.toLowerCase() > a.name.toLowerCase()) && (a.state === b.state)) {
                    return 1;
                }
                else if ((b.name.toLowerCase() < a.name.toLowerCase()) && (a.state === b.state)) {
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

function addRow(fact) {
    let columnDelimiter = ',';
    let value = '';
    let result = '';

    result += fact.name + columnDelimiter;
    result += fact.tooltip + columnDelimiter;

    if (fact.systems) {
        fact.systems.forEach(function(system) {
            value = system.value ? system.value.replace(/,/g, '') : '';
            result += value;
            result += columnDelimiter;
        });
    }

    return result;
}

function convertFactsToCSV(data, systems) {
    if (data === null || !data.length) {
        return null;
    }

    let columnDelimiter = data.columnDelimiter || ',';
    let lineDelimiter = data.lineDelimiter || '\n';

    let systemNames = systems.map(system => system.display_name);
    let mappedDates = systems.map(system => system.last_updated ? system.last_updated : system.updated);
    let systemUpdates = [];
    mappedDates.forEach((date) => {
        systemUpdates.push(moment.utc(date).format('DD MMM YYYY HH:mm UTC'));
    });

    let headers = 'Fact,State,';
    systemNames = systemNames.join(columnDelimiter);
    let result = headers + systemNames + lineDelimiter;

    systemUpdates = systemUpdates.join(columnDelimiter);
    result += columnDelimiter + columnDelimiter + systemUpdates + lineDelimiter;

    data.forEach(function(fact) {
        result += addRow(fact);
        result += lineDelimiter;

        if (fact.comparisons) {
            fact.comparisons.forEach(function(subFact) {
                result += '     ';
                result += addRow(subFact);
                result += lineDelimiter;
            });
        }
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
    filename += today.toISOString();
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

export default {
    paginateData,
    getStateSelected,
    getState,
    setTooltip,
    filterCompareData,
    sortData,
    downloadCSV,
    toggleExpandedRow,
    updateStateFilters
};
