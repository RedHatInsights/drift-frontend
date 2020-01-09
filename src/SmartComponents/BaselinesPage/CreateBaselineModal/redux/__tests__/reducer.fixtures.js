/*eslint-disable camelcase*/
const baselineData = ({
    account: '1234567',
    created: '2020-01-14T20:06:37.503938Z',
    display_name: 'drop the baseline',
    fact_count: 4,
    id: '1234567890',
    updated: '2020-01-14T20:06:37.503933Z',
    baseline_facts: [
        { name: 'Cloud', value: 'Strife' },
        { name: 'Tifa', value: 'Lockhart' },
        { name: 'Barrett', value: 'Wallace' },
        { name: 'hidden characters', values: [
            { name: 'Yuffie', value: 'Kisaragi' },
            { name: 'Vincent', value: 'Valentine' }
        ]}
    ]
});
/*eslint-enable camelcase*/

const errorStatusText = ({
    response: {
        data: '',
        statusText: 'error',
        status: 400
    }
});

const errorDataMessage = ({
    response: {
        data: {
            message: 'error'
        },
        status: 400
    }
});

const errorDataDetail = ({
    response: {
        data: {
            detail: 'error'
        },
        status: 400
    }
});

export default {
    baselineData,
    errorStatusText,
    errorDataMessage,
    errorDataDetail
};
