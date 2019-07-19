function buildBaselinesTable(data, selectedBaselineIds) {
    let rows = [];

    data.forEach(function(baseline) {
        let row = [];

        row.push(baseline.display_name);
        row.push(baseline.updated);

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

export default {
    buildBaselinesTable,
    setBaselineArray,
    findBaselineId
};
