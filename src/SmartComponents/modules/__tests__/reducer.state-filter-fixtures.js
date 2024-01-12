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
            ],
            tooltip: 'Same - All system facts in this row are the same.'
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
            ],
            tooltip: 'Different - At least one system fact value in this row differs.'
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
            ],
            tooltip: 'Incomplete data - At least one system fact value in this row is missing.'
        }

    ],
    /* eslint-disable camelcase */
    systems: [
        {
            display_name: 'system1',
            id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
            last_updated: '2019-01-15T14:53:15.886891Z'
        },
        {
            display_name: 'system2',
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
        ],
        tooltip: 'Same - All system facts in this row are the same.'
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
        ],
        tooltip: 'Different - At least one system fact value in this row differs.'
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
        ],
        tooltip: 'Incomplete data - At least one system fact value in this row is missing.'
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
        ],
        tooltip: 'Same - All system facts in this row are the same.'
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
        ],
        tooltip: 'Different - At least one system fact value in this row differs.'
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
        ],
        tooltip: 'Same - All system facts in this row are the same.'
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
        ],
        tooltip: 'Incomplete data - At least one system fact value in this row is missing.'
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
        ],
        tooltip: 'Different - At least one system fact value in this row differs.'
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
        ],
        tooltip: 'Incomplete data - At least one system fact value in this row is missing.'
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
