import React from 'react';
import selectedReducer from '../reducers';
import types from '../../SmartComponents/modules/types';
import fixtures from './reducer.fixtures';
import { ServerIcon } from '@patternfly/react-icons';
import DriftTooltip from '../../SmartComponents/DriftTooltip/DriftTooltip';

describe('compare reducer', () => {
    let reducer;
    let inventoryActions;

    beforeEach(() => {
        inventoryActions = { LOAD_ENTITIES_FULFILLED: 'LOAD_ENTITIES_FULFILLED' },
        reducer = selectedReducer(inventoryActions);
    });

    it('should handle LOAD_ENTITIES_FULFILLED', () => {
        reducer = selectedReducer(
            inventoryActions,
            undefined,
            false,
            []
        );
        expect(
            reducer({
                columns: fixtures.columns,
                rows: fixtures.results,
                selectedSystemIds: []
            }, {
                payload: {
                    results: fixtures.results
                },
                type: inventoryActions.LOAD_ENTITIES_FULFILLED
            })
        ).toEqual({
            rows: fixtures.results,
            columns: fixtures.columns,
            selectedSystemIds: [],
            selectedSystems: []
        });
    });

    it('should handle LOAD_ENTITIES_FULFILLED with historical dropdown', () => {
        reducer = selectedReducer(
            inventoryActions,
            undefined,
            false,
            [],
            true,
            true
        );
        expect(
            reducer({
                columns: fixtures.columns,
                rows: fixtures.results,
                selectedSystemIds: []
            }, {
                payload: {
                    results: fixtures.results
                },
                type: inventoryActions.LOAD_ENTITIES_FULFILLED
            })
        ).toEqual({
            rows: fixtures.results,
            columns: fixtures.columnsWithHSP,
            selectedSystemIds: [],
            selectedSystems: []
        });
    });

    it('should handle LOAD_ENTITIES_FULFILLED with no hsp read permissions', () => {
        reducer = selectedReducer(
            inventoryActions,
            undefined,
            false,
            [],
            true,
            false
        );
        expect(
            reducer({
                columns: fixtures.columns,
                rows: fixtures.results,
                selectedSystemIds: []
            }, {
                payload: {
                    results: fixtures.results
                },
                type: inventoryActions.LOAD_ENTITIES_FULFILLED
            })
        ).toEqual({
            rows: fixtures.results,
            columns: fixtures.columns,
            selectedSystemIds: [],
            selectedSystems: []
        });
    });

    it('should handle SELECT_ENTITY', () => {
        expect(
            reducer({ rows: [], selectedSystemIds: []}, {
                payload:
                    {
                        id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', selected: true
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            rows: [],
            columns: undefined,
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
            ],
            selectedSystems: []
        });
    });

    it('should handle multiple SELECT_ENTITY', () => {
        expect(
            reducer({ rows: [], selectedSystemIds: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' ]}, {
                payload:
                    {
                        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', selected: true
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            rows: [],
            columns: undefined,
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2'
            ],
            selectedSystems: []
        });
    });

    it('should handle false SELECT_ENTITY', () => {
        expect(
            reducer({ rows: [], selectedSystemIds: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' ]}, {
                payload:
                    {
                        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', selected: false
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            rows: [],
            columns: undefined,
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
            ],
            selectedSystems: []
        });
    });

    it('should handle null SELECT_ENTITY', () => {
        expect(
            reducer({ rows: [], selectedSystemIds: []}, {
                payload:
                    {
                        id: null, selected: true
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            rows: [],
            columns: undefined,
            selectedSystemIds: [],
            selectedSystems: []
        });
    });

    it('should handle null SELECT_ENTITY with selected ids', () => {
        expect(
            reducer({ rows: [], selectedSystemIds: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' ]}, {
                payload:
                    {
                        id: null, selected: true
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            rows: [],
            columns: undefined,
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
            ],
            selectedSystems: []
        });
    });

    it('should handle 0 SELECT_ENTITY', () => {
        expect(
            reducer({ selectedSystemIds: [], rows: []}, {
                payload:
                    {
                        id: 0, selected: true
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            columns: undefined,
            selectedSystemIds: [],
            rows: [],
            selectedSystems: []
        });
    });

    it('should handle 0 SELECT_ENTITY with selected ids', () => {
        expect(
            reducer({ selectedSystemIds: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' ], rows: []}, {
                payload:
                    {
                        id: 0, selected: true
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            columns: undefined,
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
            ],
            rows: [],
            selectedSystems: []
        });
    });

    it('should handle 0 SELECT_ENTITY false', () => {
        expect(
            reducer({
                selectedSystemIds: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1' ],
                rows: [{ id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' }, { id: '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1' }]
            }, {
                payload:
                    {
                        id: 0, selected: false
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            columns: undefined,
            selectedSystemIds: [],
            rows: [{ id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' }, { id: '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1' }],
            selectedSystems: []
        });
    });

    it('should handle 0 SELECT_ENTITY false on without bulk select', () => {
        expect(
            reducer({
                selectedSystemIds: [
                    '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                    '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1',
                    '2c84bfvc-8t9q-52r9-b4c3-847fg51l09e1'
                ],
                rows: [{ id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' }, { id: '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1' }]
            }, {
                payload:
                    {
                        id: 0, selected: false
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            columns: undefined,
            selectedSystemIds: [ '2c84bfvc-8t9q-52r9-b4c3-847fg51l09e1' ],
            rows: [{ id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' }, { id: '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1' }],
            selectedSystems: []
        });
    });

    it('should handle 0 SELECT_ENTITY false on bulk select', () => {
        expect(
            reducer({
                selectedSystemIds: [
                    '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                    '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1',
                    '2c84bfvc-8t9q-52r9-b4c3-847fg51l09e1'
                ],
                rows: [{ id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' }, { id: '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1' }]
            }, {
                payload:
                    {
                        id: 0, selected: false, bulk: true
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            columns: undefined,
            selectedSystemIds: [],
            rows: [{ id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' }, { id: '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1' }],
            selectedSystems: []
        });
    });

    it('should set row to selected if in selectedSystemIds but not selected', () => {
        expect(
            reducer({
                selectedSystemIds: [
                    '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
                ],
                rows: [
                    { id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', selected: undefined },
                    { id: '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1', selected: undefined }
                ]
            }, {
                payload:
                    {
                        id: '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1', selected: false
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            columns: undefined,
            selectedSystemIds: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' ],
            rows: [
                { id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', selected: true },
                { id: '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1', selected: undefined }
            ],
            selectedSystems: [{
                id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                name: undefined,
                icon: <DriftTooltip
                    content='System'
                    body={ <ServerIcon /> }
                />
            }]
        });
    });
});
