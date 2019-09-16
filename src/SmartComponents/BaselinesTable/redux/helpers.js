import moment from 'moment';

function buildBaselinesTable(data, selectedBaselineIds) {
    let rows = [];

    data.forEach(function(baseline) {
        let row = [];

        let dateTimeStamp = getDateTimeStamp(baseline.updated);

        row.push(baseline.display_name);
        row.push(dateTimeStamp);

        if (selectedBaselineIds) {
            if (selectedBaselineIds.find(function(id) {
                return baseline.id === id;
            })) {
                row.selected = true;
            }
        }

        rows.push(row);
    });

    return rows;
}

function setBaselineArray(baselines, fullBaselineData) {
    let baselineArray = [];
    let baselineId = '';

    baselines.forEach(function(baseline) {
        if (baseline.selected) {
            baselineId = findBaselineId(baseline, fullBaselineData);
            baselineArray.push(baselineId);
        }
    });

    return baselineArray;
}

function findBaselineId(baseline, fullBaselineData) {
    let baselineId = '';

    fullBaselineData.forEach(function(baselineData) {
        if (baselineData.display_name === baseline[0]) {
            baselineId = baselineData.id;
        }
    });

    return baselineId;
}

function getDateTimeStamp(dateTime) {
    return moment(dateTime).fromNow();
}

function buildNewTableData(fullBaselineListData, IdToDelete) {
    let newBaselineTableData = [];

    fullBaselineListData.forEach(function(baseline) {
        if (baseline.id !== IdToDelete) {
            let dateTimeStamp = getDateTimeStamp(baseline.updated);
            newBaselineTableData.push([ baseline.display_name, dateTimeStamp ]);
        }
    });

    return newBaselineTableData;
}

function buildNewBaselineList(fullBaselineListData, IdToDelete) {
    let newBaselineList = [];

    fullBaselineListData.forEach(function(baseline) {
        if (baseline.id !== IdToDelete) {
            newBaselineList.push(baseline);
        }
    });

    return newBaselineList;
}

function findExpandedRow(fact, expandedRows) {
    let subfacts = [];

    expandedRows.forEach(function(row) {
        if (row === fact.name) {
            fact.values.forEach(function(subfact) {
                subfacts.push([ subfact.name, subfact.value ]);
            });
        }
    });

    return subfacts;
}

function filterBaselineData(baselineData, expandedRows) {
    let rows = [];
    let row;
    let subfacts = [];

    baselineData.forEach(function(fact) {
        row = [];
        row.push(fact.name);

        if (fact.values) {
            if (expandedRows.length > 0) {
                subfacts = findExpandedRow(fact, expandedRows);
            }

            if (subfacts.length > 0) {
                row.push(subfacts);
            } else {
                row.push('');
            }
        } else {
            row.push(fact.value);
        }

        rows.push(row);
    });

    return rows;
}

function toggleExpandedRow(expandedRows, factName) {
    if (expandedRows.includes(factName)) {
        expandedRows = expandedRows.filter(fact => fact !== factName);
    } else {
        expandedRows.push(factName);
    }

    return expandedRows;
}

export default {
    buildBaselinesTable,
    setBaselineArray,
    findBaselineId,
    buildNewTableData,
    buildNewBaselineList,
    filterBaselineData,
    toggleExpandedRow
};
