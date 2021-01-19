/* eslint-disable camelcase */
export const multivalues = ([
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
]);

export const comparisonsWithMultivalues = ([
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
]);

export const multivaluesWithTooltips = ([
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
]);

export const comparisonsWithMultivaluesTooltips = ([
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
        ],
        tooltip: 'Incomplete data - At least one system fact value in this category is missing.'
    }
]);
/*eslint-enable camelcase*/
