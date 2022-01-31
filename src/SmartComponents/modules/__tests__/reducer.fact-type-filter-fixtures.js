/*eslint-disable camelcase*/
export const factTypeFilterPayloadWithMultiFact = ({
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
                },
                {
                    id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: ''
                },
                {
                    id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: ''
                },
                {
                    id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
                    system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                    value: '4'
                },
                {
                    id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
                    system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                    value: '3'
                }
            ],
            tooltip: 'Different - At least one system fact value in this row differs.'
        },
        {
            name: 'bios_uuid',
            state: 'DIFFERENT',
            systems: [
                {
                    id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'FAKE-BIOS'
                },
                {
                    id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'FAKE-BIOS'
                },
                {
                    id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: 'FAKE-BIOS'
                },
                {
                    id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: ''
                },
                {
                    id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
                    system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                    value: 'FAKE-BIOS'
                },
                {
                    id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
                    system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                    value: 'FAKE-BIOS'
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
                },
                {
                    id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: 'PC-NAME'
                },
                {
                    id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: 'PC-NAME'
                },
                {
                    id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
                    system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                    value: 'PC-NAME'
                },
                {
                    id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
                    system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                    value: 'PC-NAME'
                }
            ]
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
                        },
                        {
                            id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: ''
                        },
                        {
                            id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: ''
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
                        },
                        {
                            id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: 'disabled'
                        },
                        {
                            id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: undefined
                        },
                        {
                            id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
                            system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                            value: 'disabled'
                        },
                        {
                            id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
                            system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                            value: 'disabled'
                        }
                    ]
                },
                {
                    name: 'abc',
                    state: 'INCOMPLETE_DATA',
                    multivalues: [
                        {
                            state: 'SAME',
                            systems: [
                                { id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'blah1' },
                                { id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'blah1' },
                                { id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: 'blah1' },
                                { id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: 'blah1' },
                                {
                                    id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
                                    system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                                    value: 'blah1'
                                },
                                {
                                    id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
                                    system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                                    value: 'blah1'
                                }
                            ]
                        },
                        {
                            state: 'INCOMPLETE_DATA',
                            systems: [
                                { id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: undefined },
                                { id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'blah2' },
                                { id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: 'blah2' },
                                { id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: 'blah2' },
                                {
                                    id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
                                    system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                                    value: undefined
                                },
                                {
                                    id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
                                    system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                                    value: undefined
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    systems: [
        {
            display_name: 'sgi-xe500-01.rhts.eng.bos.redhat.com',
            id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
            last_updated: '2019-01-15T14:53:15.886891Z',
            system_profile_exists: true,
            type: 'system'
        },
        {
            display_name: 'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com',
            id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2',
            last_updated: '2019-01-15T15:25:16.304899Z',
            system_profile_exists: true,
            type: 'system'
        }
    ],
    baselines: [
        {
            display_name: 'baseline1',
            id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9',
            type: 'baseline',
            updated: '2022-01-27T20:44:43.201412Z'
        },
        {
            display_name: 'baseline2',
            id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29',
            type: 'baseline',
            updated: '2022-01-27T20:44:43.201412Z'
        }
    ],
    historical_system_profiles: [
        {
            display_name: 'hspA',
            id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
            system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
            type: 'historical-system-profile',
            updated: '2021-05-15T07:24:01+00:00'
        },
        {
            display_name: 'hspB',
            id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
            system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
            type: 'historical-system-profile',
            updated: '2021-05-15T07:24:01+00:00'
        }
    ]
});

export const factTypeFiltered = ([
    {
        name: 'bios_uuid',
        state: 'DIFFERENT',
        systems: [
            {
                id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'FAKE-BIOS'
            },
            {
                id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'FAKE-BIOS'
            },
            {
                id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: 'FAKE-BIOS'
            },
            {
                id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: ''
            },
            {
                id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
                system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                value: 'FAKE-BIOS'
            },
            {
                id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
                system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                value: 'FAKE-BIOS'
            }
        ],
        tooltip: 'Different - At least one system fact value in this row differs.'
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
            },
            {
                id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: 'PC-NAME'
            },
            {
                id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: 'PC-NAME'
            },
            {
                id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
                system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                value: 'PC-NAME'
            },
            {
                id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
                system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                value: 'PC-NAME'
            }
        ],
        tooltip: 'Same - All system facts in this row are the same.'
    },
    {
        name: 'cpu_flags',
        state: 'DIFFERENT',
        tooltip: 'Different - At least one system fact value in this category differs.',
        comparisons: [
            {
                name: 'adx',
                state: 'INCOMPLETE_DATA',
                systems: [
                    {
                        id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'disabled'
                    },
                    {
                        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: undefined
                    },
                    {
                        id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: 'disabled'
                    },
                    {
                        id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: undefined
                    },
                    {
                        id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
                        system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                        value: 'disabled'
                    },
                    {
                        id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
                        system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                        value: 'disabled'
                    }
                ],
                tooltip: 'Incomplete data - At least one system fact value in this row is missing.'
            },
            {
                name: 'abc',
                state: 'INCOMPLETE_DATA',
                tooltip: 'Incomplete data - At least one system fact value in this category is missing.',
                multivalues: [
                    {
                        state: 'SAME',
                        systems: [
                            { id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'blah1' },
                            { id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'blah1' },
                            { id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: 'blah1' },
                            { id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: 'blah1' },
                            {
                                id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
                                system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                                value: 'blah1'
                            },
                            {
                                id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
                                system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                                value: 'blah1'
                            }
                        ],
                        tooltip: 'Same - All system facts in this row are the same.'
                    },
                    {
                        state: 'INCOMPLETE_DATA',
                        systems: [
                            { id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: undefined },
                            { id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'blah2' },
                            { id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: 'blah2' },
                            { id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: 'blah2' },
                            {
                                id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
                                system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                                value: undefined
                            },
                            {
                                id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
                                system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                                value: undefined
                            }
                        ],
                        tooltip: 'Incomplete data - At least one system fact value in this row is missing.'
                    }
                ]
            }
        ]
    }
]);
/*eslint-enable camelcase*/
