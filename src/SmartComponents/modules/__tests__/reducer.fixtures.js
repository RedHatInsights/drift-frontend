export const compareReducerPayload = ({
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
            state: 'SAME',
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
            state: 'DIFFERENT',
            systems: [
                {
                    id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: '4'
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
});

export const compareReducerState = ({
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
            state: 'SAME',
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
            state: 'DIFFERENT',
            systems: [
                {
                    id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: '4'
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

export const paginatedStatePageOne = ({
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
            state: 'SAME',
            systems: [
                {
                    id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'PC-NAME'
                },
                {
                    id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'PC-NAME'
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

export const paginatedStatePageTwo = ({
    facts: [
        {
            name: 'cpus',
            state: 'DIFFERENT',
            systems: [
                {
                    id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: '4'
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
