import moment from 'moment';

const threeYearsAgo = moment.utc().subtract(3, 'years');

/*eslint-disable camelcase*/
const baselinesListPayload = ({
    data: [
        {
            created: '2020-01-18T13:30:00.000000Z',
            display_name: 'beavs baseline',
            fact_count: 2,
            id: '1234',
            updated: threeYearsAgo.format(),
            mapped_system_count: 3,
            notifications_enabled: true
        },
        {
            created: '2020-02-18T13:30:00.000000Z',
            display_name: 'micjohns baseline',
            fact_count: 2,
            id: 'abcd',
            updated: threeYearsAgo.format(),
            mapped_system_count: 0,
            notifications_enabled: false
        }
    ],
    meta: {
        total_available: 2,
        count: 2
    }
});

const baselinesListEmptyPayload = ({
    data: [],
    meta: {
        total_available: 0,
        count: 0
    }
});

const baselinesListPayloadResults = ([
    {
        created: '2020-01-18T13:30:00.000000Z',
        display_name: 'beavs baseline',
        fact_count: 2,
        id: '1234',
        updated: threeYearsAgo.format()
    },
    {
        created: '2020-02-18T13:30:00.000000Z',
        display_name: 'micjohns baseline',
        fact_count: 2,
        id: 'abcd',
        updated: threeYearsAgo.format()
    }
]);
/*eslint-enable camelcase*/

const baselineTableDataRows = ([
    [ '1234', 'beavs baseline', threeYearsAgo.fromNow(), 3, true ],
    [ 'abcd', 'micjohns baseline', threeYearsAgo.fromNow(), 0, false ]
]);

const baselineTableDataRow1 = ([
    [ '1234', 'beavs baseline', threeYearsAgo.fromNow() ]
]);

const baselineTableDataRow2 = ([
    [ 'abcd', 'micjohns baseline', threeYearsAgo.fromNow() ]
]);

function baselineTableDataTwoSelected() {
    let baselineTableDataTwoSelected = [];

    baselineTableDataRows.forEach(function(row) {
        row.selected = true;
        baselineTableDataTwoSelected.push(row);
    });

    return baselineTableDataTwoSelected;
}

function baselineTableDataOneSelected() {
    let baselineTableDataOneSelected = [];

    baselineTableDataRows.forEach(function(row) {
        if (row[0] === '1234') {
            row.selected = true;
        }

        baselineTableDataOneSelected.push(row);
    });

    return baselineTableDataOneSelected;
}

const tableDataCSV = 'UUID,Name,Last updated,Associated systems,Notifications enabled\n\
1234,beavs baseline,3 years ago,3,true\n\
abcd,micjohns baseline,3 years ago,0,false\n\
';

/*eslint-disable camelcase*/
const tableDataJSON = [
    { name: 'beavs baseline', last_updated: '3 years ago', associated_systems: 3, notifications_enabled: true },
    { name: 'micjohns baseline', last_updated: '3 years ago', associated_systems: 0, notifications_enabled: false }
];
/*eslint-enable camelcase*/

export default {
    baselinesListPayload,
    baselinesListPayloadResults,
    baselineTableDataRows,
    baselineTableDataRow1,
    baselineTableDataRow2,
    baselineTableDataTwoSelected,
    baselineTableDataOneSelected,
    baselinesListEmptyPayload,
    tableDataCSV,
    tableDataJSON
};
