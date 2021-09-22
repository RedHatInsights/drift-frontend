import moment from 'moment';

/*eslint-disable camelcase*/
const baselinesListPayload = ({
    data: [
        {
            created: '2019-01-18T13:30:00.000000Z',
            display_name: 'beavs baseline',
            fact_count: 2,
            id: '1234',
            updated: '2019-05-18T15:00:00.000000Z',
            mapped_system_count: 3
        },
        {
            created: '2019-02-18T13:30:00.000000Z',
            display_name: 'micjohns baseline',
            fact_count: 2,
            id: 'abcd',
            updated: '2019-05-19T15:00:00.000000Z'
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
        created: '2019-01-18T13:30:00.000000Z',
        display_name: 'beavs baseline',
        fact_count: 2,
        id: '1234',
        updated: '2019-05-18T15:00:00.000000Z'
    },
    {
        created: '2019-02-18T13:30:00.000000Z',
        display_name: 'micjohns baseline',
        fact_count: 2,
        id: 'abcd',
        updated: '2019-05-19T15:00:00.000000Z'
    }
]);
/*eslint-enable camelcase*/

const baselineTableDataRows = ([
    [ '1234', 'beavs baseline', moment('18 May 2019, 15:00 UTC').fromNow(), 3 ],
    [ 'abcd', 'micjohns baseline', moment('19 May 2019, 15:00 UTC').fromNow(), 0 ]
]);

const baselineTableDataRow1 = ([
    [ '1234', 'beavs baseline', moment('18 May 2019, 15:00 UTC').fromNow() ]
]);

const baselineTableDataRow2 = ([
    [ 'abcd', 'micjohns baseline', moment('19 May 2019, 15:00 UTC').fromNow() ]
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

export default {
    baselinesListPayload,
    baselinesListPayloadResults,
    baselineTableDataRows,
    baselineTableDataRow1,
    baselineTableDataRow2,
    baselineTableDataTwoSelected,
    baselineTableDataOneSelected,
    baselinesListEmptyPayload
};
