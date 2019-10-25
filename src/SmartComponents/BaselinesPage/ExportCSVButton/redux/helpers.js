function convertListToCSV(data) {
    if (data === null || !data.length) {
        return null;
    }

    let columnDelimiter = data.columnDelimiter || ',';
    let lineDelimiter = data.lineDelimiter || '\n';

    let headers = 'UUID,Name,Last updated,';
    let result = headers + lineDelimiter;

    data.forEach(function(baseline) {
        baseline.forEach(function(detail) {
            result += detail;
            result += columnDelimiter;
        });

        result += lineDelimiter;
    });

    return result;
}

function convertDataToCSV(data, baselineData) {
    if (baselineData === null || !baselineData.length) {
        return null;
    }

    let columnDelimiter = ',';
    let lineDelimiter = '\n';

    /*eslint-disable camelcase*/
    let headers = 'Fact,Value,';
    let result = data.display_name + lineDelimiter + headers + lineDelimiter;
    /*eslint-enable camelcase*/

    baselineData.forEach(function(row) {
        if (row.cells.length > 1) {
            row.cells.forEach(function(rowData) {
                result += rowData;
                result += columnDelimiter;
            });

            result += lineDelimiter;
        } else if (baselineData[row.parent].isOpen) {
            row.data.modules.forEach(function(rowData) {
                result += '    ';
                result += rowData;
                result += columnDelimiter;
            });

            result += lineDelimiter;
        }
    });

    return result;
}

function downloadCSV(baselineData) {
    let filename;
    let csv;

    if (baselineData.exportType === 'baseline list') {
        filename = 'baseline-list-export-';
        csv = convertListToCSV(baselineData.exportData);
    } else if (baselineData.exportType === 'baselines data') {
        filename = 'baseline-data-export-';
        csv = convertDataToCSV(baselineData.exportData, baselineData.baselineRowData);
    }

    if (csv === null) {
        return;
    }

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

export default {
    downloadCSV
};
