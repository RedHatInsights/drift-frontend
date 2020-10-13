import selectedReducer from '../reducers';
import types from '../../SmartComponents/modules/types';

describe('compare reducer', () => {
    let reducer;

    beforeEach(() =>
        reducer = selectedReducer({ LOAD_ENTITIES_FULFILLED: 'LOAD_ENTITIES_FULFILLED' })
    );

    it('should handle SELECT_ENTITY', () => {
        expect(
            reducer({ selectedSystemIds: []}, {
                payload:
                    {
                        id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', selected: true
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
            ]
        });
    });

    it('should handle multiple SELECT_ENTITY', () => {
        expect(
            reducer({ selectedSystemIds: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' ]}, {
                payload:
                    {
                        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', selected: true
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2'
            ]
        });
    });

    it('should handle false SELECT_ENTITY', () => {
        expect(
            reducer({ selectedSystemIds: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' ]}, {
                payload:
                    {
                        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', selected: false
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
            ]
        });
    });

    it('should handle null SELECT_ENTITY', () => {
        expect(
            reducer({ selectedSystemIds: []}, {
                payload:
                    {
                        id: null, selected: true
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            selectedSystemIds: []
        });
    });

    it('should handle null SELECT_ENTITY with selected ids', () => {
        expect(
            reducer({ selectedSystemIds: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' ]}, {
                payload:
                    {
                        id: null, selected: true
                    },
                type: types.SELECT_ENTITY
            })
        ).toEqual({
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
            ]
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
            selectedSystemIds: [],
            rows: []
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
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
            ],
            rows: []
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
            selectedSystemIds: [],
            rows: [{ id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' }, { id: '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1' }]
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
            selectedSystemIds: [ '2c84bfvc-8t9q-52r9-b4c3-847fg51l09e1' ],
            rows: [{ id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' }, { id: '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1' }]
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
            selectedSystemIds: [],
            rows: [{ id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' }, { id: '9c83bfcc-8t7a-47c7-b4r2-142fg52e89e1' }]
        });
    });
});
