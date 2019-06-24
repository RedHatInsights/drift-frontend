export const stateFilteredStateAll = ({
    facts: [
        {
            name: 'bios_uuid',
            state: 'SAME',
            systems: [
                {
                    id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'FAKE-BIOS'
                },
                {
                    id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'FAKE-BIOS'
                }
            ]
        },
        {
            name: 'display_name',
            state: 'DIFFERENT',
            systems: [
                {
                    id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'PC-NAME'
                },
                {
                    id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'PC-NAME'
                }
            ]
        },
        {
            name: 'cpus',
            state: 'INCOMPLETE_DATA',
            systems: [
                {
                    id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'N/A'
                },
                {
                    id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: '3'
                }
            ]
        }

    ],
    /* eslint-disable camelcase */
    systems: [
        {
            display_name: 'sgi-xe500-01.rhts.eng.bos.redhat.com',
            id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
            last_updated: '2019-01-15T14:53:15.886891Z'
        },
        {
            display_name: 'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com',
            id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2',
            last_updated: '2019-01-15T15:25:16.304899Z'
        }
    ]
    /* eslint-enable camelcase */
});

const stateFilteredStateSame = ([
    {
        name: 'bios_uuid',
        state: 'SAME',
        systems: [
            {
                id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'FAKE-BIOS'
            },
            {
                id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'FAKE-BIOS'
            }
        ]
    }
]);

const stateFilteredStateDifferent = ([
    {
        name: 'display_name',
        state: 'DIFFERENT',
        systems: [
            {
                id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'PC-NAME'
            },
            {
                id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'PC-NAME'
            }
        ]
    }
]);

const stateFilteredStateIncomplete = ([
    {
        name: 'cpus',
        state: 'INCOMPLETE_DATA',
        systems: [
            {
                id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'N/A'
            },
            {
                id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: '3'
            }
        ]
    }
]);

const stateFilteredStateSameDiff = ([
    {
        name: 'bios_uuid',
        state: 'SAME',
        systems: [
            {
                id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'FAKE-BIOS'
            },
            {
                id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'FAKE-BIOS'
            }
        ]
    },
    {
        name: 'display_name',
        state: 'DIFFERENT',
        systems: [
            {
                id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'PC-NAME'
            },
            {
                id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'PC-NAME'
            }
        ]
    }
]);

const stateFilteredStateSameIncomplete = ([
    {
        name: 'bios_uuid',
        state: 'SAME',
        systems: [
            {
                id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'FAKE-BIOS'
            },
            {
                id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'FAKE-BIOS'
            }
        ]
    },
    {
        name: 'cpus',
        state: 'INCOMPLETE_DATA',
        systems: [
            {
                id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'N/A'
            },
            {
                id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: '3'
            }
        ]
    }
]);

const stateFilteredStateDiffIncomplete = ([
    {
        name: 'display_name',
        state: 'DIFFERENT',
        systems: [
            {
                id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'PC-NAME'
            },
            {
                id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'PC-NAME'
            }
        ]
    },
    {
        name: 'cpus',
        state: 'INCOMPLETE_DATA',
        systems: [
            {
                id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'N/A'
            },
            {
                id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: '3'
            }
        ]
    }
]);

export default {
    stateFilteredStateAll,
    stateFilteredStateSame,
    stateFilteredStateDifferent,
    stateFilteredStateIncomplete,
    stateFilteredStateSameDiff,
    stateFilteredStateSameIncomplete,
    stateFilteredStateDiffIncomplete
};
