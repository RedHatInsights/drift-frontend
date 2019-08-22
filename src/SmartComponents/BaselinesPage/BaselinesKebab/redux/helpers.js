function convertFactsToCSV(data) {
    if (data === null || !data.length) {
        return null;
    }

    let columnDelimiter = data.columnDelimiter || ',';
    let lineDelimiter = data.lineDelimiter || '\n';

    let headers = 'Name,Last Sync,';
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

function downloadCSV(baselinesTableData) {
    let csv = convertFactsToCSV(baselinesTableData);

    if (csv === null) {
        return;
    }

    let filename = 'baseline-list-export-';
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
