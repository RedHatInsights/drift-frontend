import { ASC, DESC, COLUMN_DELIMITER, LINE_DELIMITER } from '../../constants';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/helpers';
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
        } else if (state === 'INCOMPLETE_DATA_OBFUSCATED') {
            return getState('INCOMPLETE_DATA', stateFilters).selected;
        }
    });

    return isStateSelected;
}

function getState(state, stateFilters) {
    let isStateSelected;

    stateFilters.find(function(stateFilter) {
        if (stateFilter.filter === state) {
            isStateSelected = stateFilter;
        } else if (state === 'INCOMPLETE_DATA_OBFUSCATED') {
            isStateSelected = getState('INCOMPLETE_DATA', stateFilters);
        }
    });

    return isStateSelected;
}

function setTooltip (data, stateFilters, referenceId) {
    let type = data.comparisons || data.multivalues ? 'category' : 'row';
    let state = getState(data.state, stateFilters);

    if (data.state === 'SAME') {
        data.tooltip = state.display +
        ' - ' +
        'All system facts in this ' + type + ' are the same.';
    } else if (data.state === 'INCOMPLETE_DATA') {
        data.tooltip = state.display +
        ' - ' +
        'At least one system fact value in this ' + type + ' is missing.';
    } else if (data.state === 'INCOMPLETE_DATA_OBFUSCATED') {
        data.tooltip = state.display +
        ' - ' +
        'At least one system fact value in this ' + type + ' is redacted.';
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

function filterCompareData(data, stateFilters, factFilter, referenceId, activeFactFilters) {
    let filteredFacts = [];
    let filteredComparisons = [];
    let isStateSelected;
    let lowerCaseFactFilter = factFilter.toLowerCase();
    let lowerCaseActiveFilters = activeFactFilters?.map(filter => filter.toLowerCase());

    if (data === null || !data.length) {
        return [];
    }

    for (let i = 0; i < data.length; i += 1) {
        let lowerCaseFactName = data[i].name.toLowerCase();
        isStateSelected = getStateSelected(data[i].state, stateFilters);

        if (data[i].comparisons) {
            if (lowerCaseFactName === lowerCaseFactFilter || lowerCaseActiveFilters?.includes(lowerCaseFactName)) {
                setTooltip(data[i], stateFilters, referenceId);
                filteredComparisons = filterComparisons(data[i].comparisons, stateFilters, '', referenceId, []);
                filteredFacts.push({
                    name: data[i].name,
                    state: data[i].state,
                    comparisons: filteredComparisons,
                    tooltip: data[i].tooltip
                });

                continue;
            }

            filteredComparisons = filterComparisons(data[i].comparisons, stateFilters, lowerCaseFactFilter, referenceId, lowerCaseActiveFilters);

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
            if (isStateSelected && filterFact(lowerCaseFactName, lowerCaseFactFilter, lowerCaseActiveFilters)) {
                setTooltip(data[i], stateFilters, referenceId);
                filteredFacts.push(data[i]);
            }
        }
    }

    return filteredFacts;
}

/*eslint-disable camelcase*/
function filterComparisons(comparisons, stateFilters, factFilter, referenceId, activeFactFilters) {
    let filteredComparisons = [];
    let filteredMultivalueItems = [];
    let isStateSelected;

    for (let i = 0; i < comparisons.length; i++) {
        let lowerCaseFactName = comparisons[i].name.toLowerCase();
        if (comparisons[i].multivalues) {
            filteredMultivalueItems = filterMultiFacts(comparisons[i].multivalues, stateFilters, referenceId);
            if (filteredMultivalueItems.length && filterFact(lowerCaseFactName, factFilter, activeFactFilters)) {
                setTooltip(comparisons[i], stateFilters, referenceId);
                filteredComparisons.push({
                    name: comparisons[i].name,
                    state: comparisons[i].state,
                    multivalues: filteredMultivalueItems,
                    tooltip: comparisons[i].tooltip
                });
            }
        } else {
            isStateSelected = getStateSelected(comparisons[i].state, stateFilters);
            if (isStateSelected && filterFact(lowerCaseFactName, factFilter, activeFactFilters)) {
                setTooltip(comparisons[i], stateFilters, referenceId);
                filteredComparisons.push(comparisons[i]);
            }
        }
    }

    return filteredComparisons;
}
/*eslint-enable camelcase*/

function filterMultiFacts(multivalueItems, stateFilters, referenceId) {
    let filteredMultivalueItems = [];

    for (let i = 0; i < multivalueItems.length; i++) {
        if (getStateSelected(multivalueItems[i].state, stateFilters)) {
            setTooltip(multivalueItems[i], stateFilters, referenceId);
            filteredMultivalueItems.push(multivalueItems[i]);
        }
    }

    return filteredMultivalueItems;
}

function filterFact(factName, factFilter, activeFactFilters) {
    let isFiltered = false;

    if (activeFactFilters?.length > 0) {
        activeFactFilters.forEach(function(filter) {
            if (factName.includes(filter)) {
                isFiltered = true;
            }
        });

        if (!isFiltered && factFilter.length && factName.includes(factFilter)) {
            isFiltered = true;
        }

    } else if (factName.includes(factFilter)) {
        isFiltered = true;
    }

    return isFiltered;
}

/*eslint-disable camelcase*/
function sortData(filteredFacts, factSort, stateSort) {
    let filteredSubfacts;
    let newFilteredFacts;
    let filteredValues;

    newFilteredFacts = sortFacts(filteredFacts, factSort, stateSort);

    newFilteredFacts.forEach(function(fact) {
        if (fact.comparisons !== undefined && fact.comparisons.length > 0) {
            filteredSubfacts = sortFacts(fact.comparisons, factSort, stateSort);

            filteredSubfacts.forEach(function(subFact) {
                if (subFact.multivalues?.length > 0) {
                    filteredValues = sortFacts(subFact.multivalues, factSort, stateSort);
                    subFact.multivalues = filteredValues;
                }
            });

            fact.comparisons = filteredSubfacts;
        }
    });

    return newFilteredFacts;
}
/*eslint-enable camelcase*/

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
                if (a.name?.toLowerCase() > b.name?.toLowerCase()) {
                    return 1;
                }
                else if (a.name?.toLowerCase() < b.name?.toLowerCase()) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            else {
                if ((a.name?.toLowerCase() > b.name?.toLowerCase()) && (a.state === b.state)) {
                    return 1;
                }
                else if ((a.name?.toLowerCase() < b.name?.toLowerCase()) && (a.state === b.state)) {
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
                if (b.name?.toLowerCase() > a.name?.toLowerCase()) {
                    return 1;
                }
                else if (b.name?.toLowerCase() < a.name?.toLowerCase()) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            else {
                if ((b.name?.toLowerCase() > a.name?.toLowerCase()) && (a.state === b.state)) {
                    return 1;
                }
                else if ((b.name?.toLowerCase() < a.name?.toLowerCase()) && (a.state === b.state)) {
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
    let factName = fact.name ? fact.name : '';
    let value = '';
    let result = '';

    result += factName + COLUMN_DELIMITER;
    result += fact.state + COLUMN_DELIMITER;

    if (fact.systems) {
        fact.systems.forEach(function(system) {
            value = system.value ? system.value.replace(/,/g, '') : '';
            result += value;
            result += COLUMN_DELIMITER;
        });
    } else if (fact.multivalues) {
        fact.multivalues.forEach(function(value) {
            result += LINE_DELIMITER;
            result += addRow(value);
        });
    }

    return result;
}

function convertFactsToCSV(data, referenceId, systems) {
    let referenceIndex;
    if (data === null || !data.length) {
        return null;
    }

    let systemNames = systems.map(function(system, index) {
        let systemName = system.display_name;
        if (system.id === referenceId) {
            systemName += '(reference)';
            referenceIndex = index;
        }

        return systemName;
    });
    let mappedDates = systems.map(system => system.last_updated ? system.last_updated : system.updated);
    let systemUpdates = [];
    mappedDates.forEach((date, index) => {
        if (index === referenceIndex) {
            systemUpdates.push(moment.utc(date).format('DD MMM YYYY HH:mm UTC') + '(reference)');
        } else {
            systemUpdates.push(moment.utc(date).format('DD MMM YYYY HH:mm UTC'));
        }
    });

    let headers = 'Fact,State,';
    systemNames = systemNames.join(COLUMN_DELIMITER);
    let result = headers + systemNames + LINE_DELIMITER;

    systemUpdates = systemUpdates.join(COLUMN_DELIMITER);
    result += COLUMN_DELIMITER + COLUMN_DELIMITER + systemUpdates + LINE_DELIMITER;

    data.forEach(function(fact) {
        result += addRow(fact);
        result += LINE_DELIMITER;

        if (fact.comparisons) {
            fact.comparisons.forEach(function(subFact) {
                result += '     ';
                result += addRow(subFact);
                result += LINE_DELIMITER;
            });
        }
    });

    return result;
}

function convertFactsToJSON(data, referenceId, systems, factName) {
    let json = [];
    let reference = systems.find(system => system.id === referenceId);

    data.forEach(function(fact) {
        let factInfo = new Object();
        if (factName) {
            factInfo.fact = factName;
        } else {
            factInfo.fact = fact.name;
        }

        factInfo.state = fact.state;
        if (fact.comparisons) {
            factInfo.comparisons = convertFactsToJSON(fact.comparisons, referenceId, systems);
        } else if (fact.multivalues) {
            factInfo.multivalues = convertFactsToJSON(fact.multivalues, referenceId, systems, fact.name);
        } else {
            fact.systems.forEach(function(system, index) {
                factInfo[systems[index].display_name + ', ' +
                moment.utc(systems[index].last_updated).format('DD MMM YYYY, HH:mm UTC')] = system.value;
            });

            if (reference) {
                factInfo.reference = reference.display_name + ', ' + moment.utc(reference.last_updated).format('DD MMM YYYY, HH:mm UTC');
            }
        }

        json.push(factInfo);
    });

    return json;
}

function downloadHelper(type, driftData, referenceId, systems) {
    let file;
    if (type === 'csv') {
        file = convertFactsToCSV(driftData, referenceId, systems);
    } else {
        file = JSON.stringify(convertFactsToJSON(driftData, referenceId, systems));
    }

    if (file === null) {
        return;
    }

    let filename = 'system-comparison-export-';
    let today = new Date();
    filename += today.toISOString();

    downloadFile(file, filename, type);
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

function findFilterIndex(filter, activeFactFilters) {
    return activeFactFilters.indexOf(filter);
}

export default {
    paginateData,
    getStateSelected,
    getState,
    setTooltip,
    filterCompareData,
    filterComparisons,
    filterMultiFacts,
    filterFact,
    convertFactsToCSV,
    convertFactsToJSON,
    sortData,
    downloadHelper,
    toggleExpandedRow,
    updateStateFilters,
    findFilterIndex
};
