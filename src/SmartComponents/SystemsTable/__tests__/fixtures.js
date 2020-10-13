const rows = ([
    {
        id: 'ec67f65c-2bc8-4ce8-82e2-6a27cada8d31',
        tags: [
            { namespace: 'insights-client', key: 'group', value: 'XmygroupX' }
        ],
        updated: '2020-10-13T16:17:56.253419+00:00'
    },
    {
        id: '7672c0c3-db27-4b59-ace9-5724d5a2dd1b',
        tags: [
            { namespace: 'insights-client', key: 'group', value: 'XmygroupX' }
        ],
        updated: '2020-10-13T16:17:54.952780+00:00'
    },
    {
        id: '45ef6cea-b80f-46b6-90fc-00363a6f3b70',
        tags: [
            { namespace: 'insights-client', key: 'group', value: 'XmygroupX' }
        ],
        updated: '2020-10-13T16:17:54.686193+00:00'
    }
]);

const columns = ([
    { key: 'display_name', title: 'Name' },
    { key: 'tags', title: 'Tags' },
    { key: 'updated', title: 'Last seen' },
    { key: 'historical_profiles', title: 'Historical profiles' }
]);

export default {
    rows,
    columns
};
