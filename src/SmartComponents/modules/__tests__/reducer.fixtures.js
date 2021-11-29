/* eslint-disable camelcase */
export const compareReducerPayload = ({
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
            ],
            tooltip: 'Different - At least one system fact value in this row differs.'
        },
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

export const compareReducerPayloadWithCategory = ({
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
            ],
            tooltip: 'Different - At least one system fact value in this row differs.'
        },
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
            last_updated: '2019-01-15T14:53:15.886891Z'
        },
        {
            display_name: 'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com',
            id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2',
            last_updated: '2019-01-15T15:25:16.304899Z'
        }
    ]
});

export const compareReducerPayloadWithMultiFact = ({
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
                    id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: '3'
                },
                {
                    id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: '4'
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
            state: 'SAME',
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
                    id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: 'FAKE-BIOS'
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
            last_updated: '2019-01-15T14:53:15.886891Z'
        },
        {
            display_name: 'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com',
            id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2',
            last_updated: '2019-01-15T15:25:16.304899Z'
        }
    ]
});

export const compareReducerPayloadWithUppercase = ({
    facts: [
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
        },
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

export const compareReducerPayloadWithUpperCaseSubFact = ({
    facts: [
        {
            name: 'cpu_flags',
            state: 'DIFFERENT',
            comparisons: [
                {
                    name: 'aBM',
                    state: 'SAME',
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
            last_updated: '2019-01-15T14:53:15.886891Z'
        },
        {
            display_name: 'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com',
            id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2',
            last_updated: '2019-01-15T15:25:16.304899Z'
        }
    ]
});

export const sortedPayloadWithMultiFactAscDesc = ([
    {
        name: 'cpu_flags',
        state: 'DIFFERENT',
        comparisons: [
            {
                name: 'abc',
                state: 'INCOMPLETE_DATA',
                multivalues: [
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
                    },
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
            },
            {
                id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: '3'
            },
            {
                id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: '4'
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
        state: 'SAME',
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
                id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: 'FAKE-BIOS'
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
    }
]);

export const sortedPayloadWithMultiFactAscAsc = ([
    {
        name: 'bios_uuid',
        state: 'SAME',
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
                id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: 'FAKE-BIOS'
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
            },
            {
                id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9', value: '3'
            },
            {
                id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29', value: '4'
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
    }
]);

export const compareReducerState = ({
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
            ],
            tooltip: 'Different - At least one system fact value in this row differs.'
        },
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

export const sortedDesc = ({
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
            name: 'cpus',
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

export const paginatedStatePageOne = ({
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
            ],
            tooltip: 'Different - At least one system fact value in this row differs.'
        },
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

export const paginatedStatePageTwo = ({
    facts: [
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

export const systemsPayload = ([
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
]);

export const baselinesPayload = ([
    {
        display_name: 'baseline1',
        id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9',
        last_updated: '2019-01-15T14:53:15.886891Z'
    },
    {
        display_name: 'baseline2',
        id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29',
        last_updated: '2019-01-15T15:25:16.304899Z'
    }
]);

export const historicalProfilesPayload = ([
    {
        display_name: 'system1',
        id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
        system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
        updated: '2019-01-15T14:53:15.886891Z'
    },
    {
        display_name: 'system1',
        id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
        system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
        updated: '2019-01-15T15:25:16.304899Z'
    }
]);

export const mockMultiValueFacts = ({
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
            ],
            tooltip: 'Different - At least one system fact value in this row differs.'
        },
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
                                { id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'blah2' }
                            ]
                        },
                        {
                            state: 'INCOMPLETE_DATA',
                            systems: [
                                { id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: 'N/A' },
                                { id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'blah2' }
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
            last_updated: '2019-01-15T14:53:15.886891Z'
        },
        {
            display_name: 'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com',
            id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2',
            last_updated: '2019-01-15T15:25:16.304899Z'
        }
    ]
});

export const comparisonCSV = 'Fact,State,sgi-xe500-01.rhts.eng.bos.redhat.com(reference),ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com\n\
,,15 Jan 2019 14:53 UTC(reference),15 Jan 2019 15:25 UTC\n\
cpus,DIFFERENT,4,3\n\
bios_uuid,SAME,FAKE-BIOS,FAKE-BIOS\n\
display_name,SAME,PC-NAME,PC-NAME\n\
cpu_flags,DIFFERENT\n\
     abm,SAME,enabled,enabled\n\
     adx,INCOMPLETE_DATA,disabled,\n\
';

export const fullSimpleComparison = ({
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
            ],
            tooltip: 'Different - At least one system fact value in this row differs.'
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
                                { id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'blah1' }
                            ]
                        },
                        {
                            state: 'INCOMPLETE_DATA',
                            systems: [
                                { id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', value: undefined },
                                { id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', value: 'blah2' }
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
            last_updated: '2019-01-15T14:53:15.886891Z'
        },
        {
            display_name: 'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com',
            id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2',
            last_updated: '2019-01-15T15:25:16.304899Z'
        }
    ]
});

export const comparisonJSON = [
    {
        fact: 'cpus',
        state: 'DIFFERENT',
        'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com, 15 Jan 2019, 15:25 UTC': '3',
        'sgi-xe500-01.rhts.eng.bos.redhat.com, 15 Jan 2019, 14:53 UTC': '4',
        reference: 'sgi-xe500-01.rhts.eng.bos.redhat.com, 15 Jan 2019, 14:53 UTC'
    },
    {
        fact: 'cpu_flags',
        state: 'DIFFERENT',
        comparisons: [
            {
                fact: 'abm',
                state: 'SAME',
                'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com, 15 Jan 2019, 15:25 UTC': 'enabled',
                'sgi-xe500-01.rhts.eng.bos.redhat.com, 15 Jan 2019, 14:53 UTC': 'enabled',
                reference: 'sgi-xe500-01.rhts.eng.bos.redhat.com, 15 Jan 2019, 14:53 UTC'
            },
            {
                fact: 'abc',
                state: 'INCOMPLETE_DATA',
                multivalues: [
                    {
                        fact: 'abc',
                        state: 'SAME',
                        'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com, 15 Jan 2019, 15:25 UTC': 'blah1',
                        'sgi-xe500-01.rhts.eng.bos.redhat.com, 15 Jan 2019, 14:53 UTC': 'blah1',
                        reference: 'sgi-xe500-01.rhts.eng.bos.redhat.com, 15 Jan 2019, 14:53 UTC'
                    },
                    {
                        fact: 'abc',
                        state: 'INCOMPLETE_DATA',
                        'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com, 15 Jan 2019, 15:25 UTC': 'blah2',
                        'sgi-xe500-01.rhts.eng.bos.redhat.com, 15 Jan 2019, 14:53 UTC': undefined,
                        reference: 'sgi-xe500-01.rhts.eng.bos.redhat.com, 15 Jan 2019, 14:53 UTC'
                    }
                ]
            }
        ]
    }
];
/* eslint-enable camelcase */
