/*eslint-disable camelcase*/
const masterListSystem = [
    {
        display_name: 'systemA',
        id: 'dc47qffd-09rt-2kw7-8b9b-53f4g716fec5',
        type: 'system',
        updated: '2020-11-02T12:41:59.029271Z'
    }
];

const masterListAll = [
    {
        display_name: 'baselineA',
        id: '12e4d81b-f1c6-489a-a829-9d96f3a71f53',
        type: 'baseline',
        updated: '2021-04-30T23:53:03.235265Z'
    },
    {
        display_name: 'systemA',
        id: 'dc47qffd-09rt-2kw7-8b9b-53f4g716fec5',
        type: 'system',
        updated: '2020-11-02T12:41:59.029271Z'
    },
    {
        display_name: 'hspA',
        id: 'e3ed3e34-eaa1-45c4-8633-94fef1f678f1',
        system_id: 'dc47qffd-09rt-2kw7-8b9b-53f4g716fec5',
        type: 'historical-system-profile',
        updated: '2021-05-15T07:24:01+00:00'
    }
];

export default {
    masterListSystem,
    masterListAll
};
/*eslint-enable camelcase*/
