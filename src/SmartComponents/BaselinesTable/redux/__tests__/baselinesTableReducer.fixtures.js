/*eslint-disable camelcase*/
const baselinesListPayload = ({
    count: 2,
    page: 1,
    per_page: 50,
    results: [
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
    ],
    total: 2
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
    [ 'beavs baseline', '2019-05-18T15:00:00.000000Z' ],
    [ 'micjohns baseline', '2019-05-19T15:00:00.000000Z' ]
]);

export default {
    baselinesListPayload,
    baselinesListPayloadResults,
    baselineTableDataRows
};
