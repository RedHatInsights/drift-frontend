import { compareReducer } from '../reducers';
import types from '../types';
import { ASC, DESC } from '../../../constants';

import { compareReducerPayload, compareReducerState, paginatedStatePageOne, paginatedStatePageTwo } from './reducer.fixtures';
import { factFilteredStateOne, factFilteredStateTwo } from './reducer.fact-filter-fixtures';

describe('compare reducer', () => {
    it('should return initial state', () => {
        expect(compareReducer(undefined, {})).toEqual(
            {
                fullCompareData: [],
                sortedFilteredFacts: [],
                factFilter: '',
                stateFilters: [
                    { filter: 'SAME', display: 'Same', selected: true },
                    { filter: 'DIFFERENT', display: 'Different', selected: true },
                    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
                ],
                factSort: ASC,
                stateSort: DESC,
                filteredCompareData: [],
                systems: [],
                previousStateSystems: [],
                page: 1,
                perPage: 50,
                totalFacts: 0,
                loading: false,
                expandedRows: [],
                error: {}
            }
        );
    });

    it('should handle FETCH_COMPARE_PENDING', () => {
        expect(
            compareReducer({ systems: [], loading: false }, {
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
            compareReducer({ systems: compareReducerPayload.systems, loading: false }, {
                type: `${types.FETCH_COMPARE}_PENDING`
            })
        ).toEqual({
            previousStateSystems: compareReducerState.systems,
            systems: [],
            loading: true
        });
    });

    it('should handle FETCH_COMPARE_FULFILLED', () => {
        expect(
            compareReducer({
                perPage: 50,
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
            perPage: 50,
            stateFilters: [
                { filter: 'SAME', display: 'Same', selected: true },
                { filter: 'DIFFERENT', display: 'Different', selected: true },
                { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
            ],
            totalFacts: 3
        });
    });

    it('should handle UPDATE_PAGINATION no data', () => {
        expect(
            compareReducer({
                perPage: 50,
                page: 1,
                fullCompareData: [],
                systems: [],
                factFilter: '',
                stateFilter: 'all' },
            {
                payload: { perPage: 2, page: 1 },
                type: `${types.UPDATE_PAGINATION}`
            })
        ).toEqual({
            fullCompareData: [],
            factFilter: '',
            filteredCompareData: [],
            sortedFilteredFacts: [],
            systems: [],
            page: 1,
            perPage: 2,
            stateFilter: 'all',
            totalFacts: 0
        });
    });

    it('should handle UPDATE_PAGINATION page one', () => {
        expect(
            compareReducer({
                perPage: 50,
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
            compareReducer({
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
            compareReducer({
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

    it('should handle FILTER_BY_FACT with text: i', () => {
        expect(
            compareReducer({
                page: 1,
                perPage: 50,
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
            perPage: 50,
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
            compareReducer({
                page: 1,
                perPage: 50,
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
            perPage: 50,
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
            compareReducer({
                page: 1,
                perPage: 50,
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
            perPage: 50,
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
            compareReducer({
                page: 1,
                perPage: 50,
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
            perPage: 50,
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
            compareReducer({
                page: 1,
                perPage: 50,
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
            perPage: 50,
            stateFilters: [
                { filter: 'SAME', display: 'Same', selected: false },
                { filter: 'DIFFERENT', display: 'Different', selected: true },
                { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: false }
            ],
            totalFacts: 0
        });
    });
});
