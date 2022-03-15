import moment from 'moment';

function returnParams (fetchParams = {}) {
    let params = {};

    /*eslint-disable camelcase*/
    params.order_by = fetchParams.orderBy;
    params.order_how = fetchParams.orderHow;
    params.limit = fetchParams.perPage;
    params.offset = (fetchParams.page - 1) * fetchParams.perPage;

    if (fetchParams.search) {
        params.display_name = fetchParams.search;
    }
    /*eslint-enable camelcase*/

    return params;
}

function buildBaselinesTable(data, selectedBaselineIds) {
    let rows = [];

    data.forEach(function(baseline) {
        let row = [];

        let dateTimeStamp = getDateTimeStamp(baseline.updated);

        row.push(baseline.id);
        row.push(baseline.display_name);
        row.push(dateTimeStamp);
        row.push(baseline.mapped_system_count ? baseline.mapped_system_count : 0);
        row.push(baseline.notifications_enabled);

        rows.push(row);
    });

    if (selectedBaselineIds) {
        rows = setSelected(rows, selectedBaselineIds);
    }

    return rows;
}

function setSelected(baselineRows, selectedBaselineIds) {
    if (selectedBaselineIds === undefined) {
        selectedBaselineIds = [];
    }

    baselineRows.forEach(function(baseline) {
        let found = selectedBaselineIds.find(function(id) {
            return baseline[0] === id;
        });

        if (found !== undefined) {
            baseline.selected = true;
        }
    });

    return baselineRows;
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

function toggleExpandedRow(expandedRows, factName) {
    if (expandedRows.includes(factName)) {
        expandedRows = expandedRows.filter(fact => fact !== factName);
    } else {
        expandedRows.push(factName);
    }

    return expandedRows;
}

function convertListToCSV(data) {
    if (data === null || !data.length) {
        return null;
    }

    let columnDelimiter = data.columnDelimiter || ',';
    let lineDelimiter = data.lineDelimiter || '\n';

    let headers = 'UUID,Name,Last updated,Associated systems';
    let result = headers + lineDelimiter;

    data.forEach(function(baseline) {
        baseline.forEach(function(detail, index) {
            result += detail;
            if (index + 1 !== baseline.length) {
                result += columnDelimiter;
            }
        });

        result += lineDelimiter;
    });

    return result;
}

/*eslint-disable camelcase*/
function convertListToJSON(data) {
    if (data === null || !data.length) {
        return null;
    }

    let json = [];

    data.forEach(function(baseline) {
        let row = new Object();
        row.name = baseline[1];
        row.last_updated = baseline[2];
        row.associated_systems = baseline[3];
        row.notifications_enabled = baseline[4];
        json.push(row);
    });

    return JSON.stringify(json);
}
/*eslint-enable camelcase*/

export default {
    returnParams,
    buildBaselinesTable,
    setBaselineArray,
    toggleExpandedRow,
    setSelected,
    convertListToCSV,
    convertListToJSON
};
