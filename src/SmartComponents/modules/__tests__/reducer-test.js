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
                sort: 'asc',
                stateFilter: 'all',
                filteredCompareData: [],
                systems: [],
                previousStateSystems: [],
                page: 1,
                perPage: 10,
                totalFacts: 0,
                loading: false,
                expandedRows: [],
                kebabOpened: false,
                errorAlertOpened: false,
                error: {}
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
            stateFilter: 'all',
            totalFacts: 2
        });
    });
});

describe('add system modal reducer', () => {
    it('should return initial state', () => {
        expect(reducers.addSystemModalReducer(undefined, {})).toEqual(
            {
                fullCompareData: [],
                systems: [],
                previousStateSystems: [],
                addSystemModalOpened: false,
                sortedFilteredFacts: [],
                factFilter: '',
                filterDropdownOpened: false,
                sort: 'asc',
                stateFilter: 'all',
                filteredCompareData: [],
                page: 1,
                perPage: 10,
                totalFacts: 0,
                loading: false,
                expandedRows: [],
                kebabOpened: false,
                errorAlertOpened: false,
                error: {}
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
                previousStateSystems: [],
                addSystemModalOpened: false,
                sortedFilteredFacts: [],
                factFilter: '',
                filterDropdownOpened: false,
                sort: 'asc',
                stateFilter: 'all',
                filteredCompareData: [],
                page: 1,
                perPage: 10,
                totalFacts: 0,
                loading: false,
                expandedRows: [],
                kebabOpened: false,
                errorAlertOpened: false,
                error: {}
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
