/*eslint-disable camelcase*/
const historicalData = ({
    profiles: [
        {
            captured_date: '2020-05-04T17:09:34+00:00',
            id: '79a527b0-c1f4-4f9e-bbf9-9cd4c8f5d918',
            system_id: '4416c520-a339-4dde-b303-f317ea9efc5f'
        },
        {
            captured_date: '2020-05-04T15:46:03+00:00',
            id: '5db26cd6-2bdd-470e-b533-77a7e6565a1b',
            system_id: '4416c520-a339-4dde-b303-f317ea9efc5f'
        },
        {
            captured_date: '2020-05-04T14:22:33+00:00',
            id: 'a17cbd22-7c4b-4bc0-a9f3-633f4d6beb43',
            system_id: '4416c520-a339-4dde-b303-f317ea9efc5f'
        }
    ]
});
/*eslint-enable camelcase*/

const hspReturnedError = ({
    status: 400,
    data: {
        message: 'This is an error message'
    }
});

export default {
    historicalData,
    hspReturnedError
};
