/*eslint-disable camelcase*/
const baselinesListPayload = ([
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
    [ 'beavs baseline', '18 May 2019, 15:00 UTC' ],
    [ 'micjohns baseline', '19 May 2019, 15:00 UTC' ]
]);

export default {
    baselinesListPayload,
    baselinesListPayloadResults,
    baselineTableDataRows
};
