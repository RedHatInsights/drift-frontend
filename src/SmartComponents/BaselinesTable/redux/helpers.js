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
    return moment.utc(dateTime).format('DD MMM YYYY, HH:mm UTC');
}

function removeDeletedRow(fullBaselineListData, IdToDelete) {
    let newBaselineTableData = [];

    fullBaselineListData.forEach(function(baseline) {
        if (baseline.id !== IdToDelete) {
            let dateTimeStamp = getDateTimeStamp(baseline.updated);
            newBaselineTableData.push([ baseline.display_name, dateTimeStamp ]);
        }
    });

    return newBaselineTableData;
}

export default {
    buildBaselinesTable,
    setBaselineArray,
    findBaselineId,
    removeDeletedRow
};
