import reducers from '../reducers';
import types from '../types';

import { compareReducerPayload, compareReducerState } from './reducer.fixtures';

describe('compare reducer', () => {
    it('should return initial state', () => {
        expect(reducers.compareReducer(undefined, {})).toEqual(
            {
                fullCompareData: [],
                addSystemModalOpened: false,
                sortedFilteredFacts: [],
                factFilter: '',
                filterDropdownOpened: false,
                selectedSystemIds: [],
                sort: 'asc',
                stateFilter: 'all',
                filteredCompareData: [],
                systems: [],
                page: 1,
                perPage: 10,
                totalFacts: 0,
                loading: false,
                expandedRows: [],
                kebabOpened: false
            }
        );
    });

    it('should handle FETCH_COMPARE_FULFILLED', () => {
        expect(
            reducers.compareReducer({ perPage: 10, page: 1, stateFilter: 'all', factFilter: '' }, {
                payload: compareReducerPayload,
                type: `${types.FETCH_COMPARE}_FULFILLED`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            loading: false,
            factFilter: '',
            filteredCompareData: compareReducerState.facts,
            sortedFilteredFacts: compareReducerState.facts,
            systems: compareReducerState.systems,
            page: 1,
            perPage: 10,
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
                'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2'
            ],
            stateFilter: 'all',
            totalFacts: 2
        });
    });

    it('should handle SELECT_ENTITY', () => {
        expect(
            reducers.compareReducer({ selectedSystemIds: []}, {
                payload:
                    {
                        id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', selected: true
                    },
                type: `${types.SELECT_ENTITY}`
            })
        ).toEqual({
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
            ]
        });
    });

    it('should handle multiple SELECT_ENTITY', () => {
        expect(
            reducers.compareReducer({ selectedSystemIds: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' ]}, {
                payload:
                    {
                        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', selected: true
                    },
                type: `${types.SELECT_ENTITY}`
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
            reducers.compareReducer({ selectedSystemIds: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' ]}, {
                payload:
                    {
                        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', selected: false
                    },
                type: `${types.SELECT_ENTITY}`
            })
        ).toEqual({
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
            ]
        });
    });

    it('should handle null SELECT_ENTITY', () => {
        expect(
            reducers.compareReducer({ selectedSystemIds: []}, {
                payload:
                    {
                        id: null, selected: true
                    },
                type: `${types.SELECT_ENTITY}`
            })
        ).toEqual({
            selectedSystemIds: []
        });
    });

    it('should handle null SELECT_ENTITY with selected ids', () => {
        expect(
            reducers.compareReducer({ selectedSystemIds: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' ]}, {
                payload:
                    {
                        id: null, selected: true
                    },
                type: `${types.SELECT_ENTITY}`
            })
        ).toEqual({
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
            ]
        });
    });

    it('should handle 0 SELECT_ENTITY', () => {
        expect(
            reducers.compareReducer({ selectedSystemIds: []}, {
                payload:
                    {
                        id: 0, selected: true
                    },
                type: `${types.SELECT_ENTITY}`
            })
        ).toEqual({
            selectedSystemIds: []
        });
    });

    it('should handle 0 SELECT_ENTITY with selected ids', () => {
        expect(
            reducers.compareReducer({ selectedSystemIds: [ '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' ]}, {
                payload:
                    {
                        id: 0, selected: true
                    },
                type: `${types.SELECT_ENTITY}`
            })
        ).toEqual({
            selectedSystemIds: [
                '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
            ]
        });
    });
});

describe('add system modal reducer', () => {
    it('should return initial state', () => {
        expect(reducers.addSystemModalReducer(undefined, {})).toEqual(
            {
                fullCompareData: [],
                systems: [],
                addSystemModalOpened: false,
                sortedFilteredFacts: [],
                factFilter: '',
                filterDropdownOpened: false,
                selectedSystemIds: [],
                sort: 'asc',
                stateFilter: 'all',
                filteredCompareData: [],
                page: 1,
                perPage: 10,
                totalFacts: 0,
                loading: false,
                expandedRows: [],
                kebabOpened: false
            }
        );
    });

    it('should handle OPEN_ADD_SYSTEM_MODAL true', () => {
        expect(
            reducers.addSystemModalReducer({ addSystemModalOpened: false }, {
                type: `${types.OPEN_ADD_SYSTEM_MODAL}`
            })
        ).toEqual({
            addSystemModalOpened: true
        });
    });

    it('should handle OPEN_ADD_SYSTEM_MODAL false', () => {
        expect(
            reducers.addSystemModalReducer({ addSystemModalOpened: true }, {
                type: `${types.OPEN_ADD_SYSTEM_MODAL}`
            })
        ).toEqual({
            addSystemModalOpened: false
        });
    });
});

describe('export reducer', () => {
    it('should return initial state', () => {
        expect(reducers.exportReducer(undefined, {})).toEqual(
            {
                fullCompareData: [],
                systems: [],
                addSystemModalOpened: false,
                sortedFilteredFacts: [],
                factFilter: '',
                filterDropdownOpened: false,
                selectedSystemIds: [],
                sort: 'asc',
                stateFilter: 'all',
                filteredCompareData: [],
                page: 1,
                perPage: 10,
                totalFacts: 0,
                loading: false,
                expandedRows: [],
                kebabOpened: false
            }
        );
    });

    it('should handle TOGGLE_KEBAB true', () => {
        expect(
            reducers.exportReducer({ kebabOpened: false }, {
                type: `${types.TOGGLE_KEBAB}`
            })
        ).toEqual({
            kebabOpened: true
        });
    });

    it('should handle TOGGLE_KEBAB false', () => {
        expect(
            reducers.exportReducer({ kebabOpened: true }, {
                type: `${types.TOGGLE_KEBAB}`
            })
        ).toEqual({
            kebabOpened: false
        });
    });
});
