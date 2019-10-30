import moment from 'moment';

function buildBaselinesTable(data, selectedBaselineIds) {
    let rows = [];

    data.forEach(function(baseline) {
        let row = [];

        let dateTimeStamp = getDateTimeStamp(baseline.updated);

        row.push(baseline.id);
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

function setBaselineArray(baselines) {
    let baselineArray = [];

    baselines.forEach(function(baseline) {
        if (baseline.selected) {
            baselineArray.push(baseline[0]);
        }
    });

    return baselineArray;
}

function getDateTimeStamp(dateTime) {
    return moment(dateTime).fromNow();
}

function buildNewTableData(fullBaselineListData, IdToDelete) {
    let newBaselineTableData = [];

    fullBaselineListData.forEach(function(baseline) {
        if (baseline.id !== IdToDelete) {
            let dateTimeStamp = getDateTimeStamp(baseline.updated);
            newBaselineTableData.push([ baseline.id, baseline.display_name, dateTimeStamp ]);
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
    buildNewTableData,
    buildNewBaselineList,
    toggleExpandedRow
};
