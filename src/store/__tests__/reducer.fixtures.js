/*eslint-disable camelcase*/
const columns = [
    {
        key: 'display_name',
        title: 'Name',
        props: {
            width: 20
        }
    },
    {
        key: 'system_profile',
        title: 'Operating system',
        props: {
            width: 10,
            isStatic: true
        }
    },
    {
        key: 'tags',
        title: 'Tags',
        props: {
            width: 10,
            isStatic: true
        }
    },
    {
        key: 'updated',
        title: 'Last seen',
        props: {
            width: 10
        }
    }
];

const columnsWithHSP = [
    {
        key: 'display_name',
        title: 'Name',
        props: {
            width: 20
        }
    },
    {
        key: 'system_profile',
        title: 'Operating system',
        props: {
            width: 10,
            isStatic: true
        }
    },
    {
        key: 'tags',
        title: 'Tags',
        props: {
            width: 10,
            isStatic: true
        }
    },
    {
        key: 'updated',
        title: 'Last seen',
        props: {
            width: 10
        }
    },
    {
        key: 'historical_profiles',
        title: 'Historical profiles',
        props: {
            width: 10,
            isStatic: true
        }
    }
];

const results = [
    {
        display_name: 'system1',
        id: 'ee407ed6-727a-4849-a7b2-2c8f891e8b4c',
        system_profile: {},
        tags: [],
        updated: '2021-05-18T16:17:13.958286+00:00'
    }
];

export default {
    columns,
    columnsWithHSP,
    results
};
/*eslint-enable camelcase*/
