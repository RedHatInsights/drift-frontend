import reducers from '../reducers';
import types from '../types';

import { compareReducerPayload, compareReducerState, paginatedStatePageOne, paginatedStatePageTwo } from './reducer.fixtures';
import { factFilteredStateOne, factFilteredStateTwo } from './reducer.fact-filter-fixtures';

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
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ],
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
            reducers.compareReducer({
                perPage: 10,
                page: 1,
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ],
                factFilter: '' },
            {
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
            stateFilters: [
                { filter: 'SAME', display: 'Same', selected: true },
                { filter: 'DIFFERENT', display: 'Different', selected: true },
                { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
            ],
            totalFacts: 3
        });
    });

    it('should handle UPDATE_PAGINATION page one', () => {
        expect(
            reducers.compareReducer({
                perPage: 10,
                page: 1,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ]},
            {
                payload: { perPage: 2, page: 1 },
                type: `${types.UPDATE_PAGINATION}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: '',
            filteredCompareData: paginatedStatePageOne.facts,
            sortedFilteredFacts: compareReducerState.facts,
            systems: paginatedStatePageOne.systems,
            page: 1,
            perPage: 2,
            stateFilters: [
                { filter: 'SAME', display: 'Same', selected: true },
                { filter: 'DIFFERENT', display: 'Different', selected: true },
                { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
            ],
            totalFacts: 3
        });
    });

    it('should handle UPDATE_PAGINATION page two', () => {
        expect(
            reducers.compareReducer({
                perPage: 2,
                page: 1,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ]},
            {
                payload: { perPage: 2, page: 2 },
                type: `${types.UPDATE_PAGINATION}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: '',
            filteredCompareData: paginatedStatePageTwo.facts,
            sortedFilteredFacts: compareReducerState.facts,
            systems: paginatedStatePageTwo.systems,
            page: 2,
            perPage: 2,
            stateFilters: [
                { filter: 'SAME', display: 'Same', selected: true },
                { filter: 'DIFFERENT', display: 'Different', selected: true },
                { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
            ],
            totalFacts: 3
        });
    });

    it('should handle UPDATE_PAGINATION page three is empty', () => {
        expect(
            reducers.compareReducer({
                perPage: 2,
                page: 2,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ]},
            {
                payload: { perPage: 2, page: 3 },
                type: `${types.UPDATE_PAGINATION}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: '',
            filteredCompareData: [],
            sortedFilteredFacts: compareReducerState.facts,
            systems: paginatedStatePageTwo.systems,
            page: 3,
            perPage: 2,
            stateFilters: [
                { filter: 'SAME', display: 'Same', selected: true },
                { filter: 'DIFFERENT', display: 'Different', selected: true },
                { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
            ],
            totalFacts: 3
        });
    });

    it('should handle FETCH_COMPARE_PENDING', () => {
        expect(
            reducers.compareReducer({ systems: [], loading: false }, {
                type: `${types.FETCH_COMPARE}_PENDING`
            })
        ).toEqual({
            previousStateSystems: [],
            systems: [],
            loading: true
        });
    });

    it('should handle FETCH_COMPARE_PENDING with previous systems', () => {
        expect(
            reducers.compareReducer({ systems: compareReducerPayload.systems, loading: false }, {
                type: `${types.FETCH_COMPARE}_PENDING`
            })
        ).toEqual({
            previousStateSystems: compareReducerState.systems,
            systems: [],
            loading: true
        });
    });

    it('should handle FILTER_BY_FACT with text: i', () => {
        expect(
            reducers.compareReducer({
                page: 1,
                perPage: 10,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ]},
            {
                payload: 'i',
                type: `${types.FILTER_BY_FACT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: 'i',
            filteredCompareData: factFilteredStateOne.facts,
            sortedFilteredFacts: factFilteredStateOne.facts,
            systems: factFilteredStateOne.systems,
            page: 1,
            perPage: 10,
            stateFilters: [
                { filter: 'SAME', display: 'Same', selected: true },
                { filter: 'DIFFERENT', display: 'Different', selected: true },
                { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
            ],
            totalFacts: 2
        });
    });

    it('should handle FILTER_BY_FACT with text: io', () => {
        expect(
            reducers.compareReducer({
                page: 1,
                perPage: 10,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: 'i',
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ]},
            {
                payload: 'io',
                type: `${types.FILTER_BY_FACT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: 'io',
            filteredCompareData: factFilteredStateTwo.facts,
            sortedFilteredFacts: factFilteredStateTwo.facts,
            systems: factFilteredStateTwo.systems,
            page: 1,
            perPage: 10,
            stateFilters: [
                { filter: 'SAME', display: 'Same', selected: true },
                { filter: 'DIFFERENT', display: 'Different', selected: true },
                { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
            ],
            totalFacts: 1
        });
    });

    it('should handle FILTER_BY_FACT with text: iou', () => {
        expect(
            reducers.compareReducer({
                page: 1,
                perPage: 10,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: 'io',
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ]},
            {
                payload: 'iou',
                type: `${types.FILTER_BY_FACT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: 'iou',
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: compareReducerState.systems,
            page: 1,
            perPage: 10,
            stateFilters: [
                { filter: 'SAME', display: 'Same', selected: true },
                { filter: 'DIFFERENT', display: 'Different', selected: true },
                { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
            ],
            totalFacts: 0
        });
    });

    it('should handle FILTER_BY_FACT with text: io and state: SAME', () => {
        expect(
            reducers.compareReducer({
                page: 1,
                perPage: 10,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: false },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: false }
                ]},
            {
                payload: 'io',
                type: `${types.FILTER_BY_FACT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: 'io',
            filteredCompareData: factFilteredStateTwo.facts,
            sortedFilteredFacts: factFilteredStateTwo.facts,
            systems: factFilteredStateTwo.systems,
            page: 1,
            perPage: 10,
            stateFilters: [
                { filter: 'SAME', display: 'Same', selected: true },
                { filter: 'DIFFERENT', display: 'Different', selected: false },
                { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: false }
            ],
            totalFacts: 1
        });
    });

    it('should handle FILTER_BY_FACT with text: io and state: DIFFERENT', () => {
        expect(
            reducers.compareReducer({
                page: 1,
                perPage: 10,
                fullCompareData: compareReducerPayload.facts,
                systems: compareReducerPayload.systems,
                factFilter: '',
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: false },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: false }
                ]},
            {
                payload: 'io',
                type: `${types.FILTER_BY_FACT}`
            })
        ).toEqual({
            fullCompareData: compareReducerState.facts,
            factFilter: 'io',
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: compareReducerState.systems,
            page: 1,
            perPage: 10,
            stateFilters: [
                { filter: 'SAME', display: 'Same', selected: false },
                { filter: 'DIFFERENT', display: 'Different', selected: true },
                { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: false }
            ],
            totalFacts: 0
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
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ],
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

describe('filter dropdown reducer', () => {
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
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ],
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

    it('should handle OPEN_FILTER_DROPDOWN true', () => {
        expect(
            reducers.filterDropdownReducer({ filterDropdownOpened: false }, {
                type: `${types.OPEN_FILTER_DROPDOWN}`
            })
        ).toEqual({
            filterDropdownOpened: true
        });
    });

    it('should handle OPEN_FILTER_DROPDOWN false', () => {
        expect(
            reducers.filterDropdownReducer({ filterDropdownOpened: true }, {
                type: `${types.OPEN_FILTER_DROPDOWN}`
            })
        ).toEqual({
            filterDropdownOpened: false
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
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ],
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
