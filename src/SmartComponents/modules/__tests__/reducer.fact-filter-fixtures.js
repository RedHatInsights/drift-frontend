/* eslint-disable camelcase */
export const factFilteredStateOne = ({
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
            state: 'SAME',
            systems: [
                {
                    id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'PC-NAME'
                },
                {
                    id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'PC-NAME'
                }
            ],
            tooltip: 'Same - All system facts in this row are the same.'
        }
    ],
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

export const factFilteredStateTwo = ({
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
        }
    ],
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

export const activeFactFilteredStateOne = ({
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
        }
    ],
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

export const activeFactFilteredStateTwo = ({
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
            name: 'cpu_flags',
            state: 'DIFFERENT',
            comparisons: [
                {
                    name: 'abm',
                    state: 'SAME',
                    systems: [
                        {
                            id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'enabled'
                        },
                        {
                            id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'enabled'
                        }
                    ],
                    tooltip: 'Same - All system facts in this row are the same.'
                }
            ],
            tooltip: 'Different - At least one system fact value in this category differs.'
        }
    ],
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

export const filteredCategory = ([
    {
        name: 'cpu_flags',
        state: 'DIFFERENT',
        comparisons: [
            {
                name: 'abm',
                state: 'SAME',
                systems: [
                    {
                        id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'enabled'
                    },
                    {
                        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'enabled'
                    }
                ],
                tooltip: 'Same - All system facts in this row are the same.'
            },
            {
                name: 'adx',
                state: 'INCOMPLETE_DATA',
                systems: [
                    {
                        id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'disabled'
                    },
                    {
                        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: undefined
                    }
                ],
                tooltip: 'Incomplete data - At least one system fact value in this row is missing.'
            }
        ],
        tooltip: 'Different - At least one system fact value in this category differs.'
    }
]);

export const filteredCategoryAndFact = ([
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
        name: 'cpu_flags',
        state: 'DIFFERENT',
        comparisons: [
            {
                name: 'abm',
                state: 'SAME',
                systems: [
                    {
                        id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'enabled'
                    },
                    {
                        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'enabled'
                    }
                ],
                tooltip: 'Same - All system facts in this row are the same.'
            },
            {
                name: 'adx',
                state: 'INCOMPLETE_DATA',
                systems: [
                    {
                        id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'disabled'
                    },
                    {
                        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: undefined
                    }
                ],
                tooltip: 'Incomplete data - At least one system fact value in this row is missing.'
            }
        ],
        tooltip: 'Different - At least one system fact value in this category differs.'
    }
]);

export const filteredUpperCaseFact = ([
    {
        name: 'Cpus',
        state: 'DIFFERENT',
        systems: [
            {
                id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: '4'
            },
            {
                id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: '3'
            }
        ],
        tooltip: 'Different - At least one system fact value in this row differs.'
    }
]);

export const filteredUpperCaseSubFact = ([
    {
        name: 'cpu_flags',
        state: 'DIFFERENT',
        tooltip: 'Different - At least one system fact value in this category differs.',
        comparisons: [
            {
                name: 'aBM',
                state: 'SAME',
                tooltip: 'Same - All system facts in this row are the same.',
                systems: [
                    {
                        id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'enabled'
                    },
                    {
                        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'enabled'
                    },
                    {
                        id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: 'enabled'
                    },
                    {
                        id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: 'enabled'
                    },
                    {
                        id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
                        system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                        value: 'enabled'
                    },
                    {
                        id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
                        system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                        value: 'enabled'
                    }
                ]
            }
        ]
    }
]);
/*eslint-enable camelcase*/
