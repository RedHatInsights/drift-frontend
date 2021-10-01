import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import moxios from 'moxios';

import actions from '../actions';
import types from '../types';

import { ASC, DESC } from '../../../constants';
import { compareActions } from '../index';

describe('compare actions', () => {
    const middlewares = [ promiseMiddleware() ];
    const mockStore = configureMockStore(middlewares);

    beforeEach(function () {
        moxios.install();
    });

    afterEach(function () {
        moxios.uninstall();
    });

    it.skip('creates FETCH_COMPARE_FULLFILLED when fetching compare has been done', () => {
        moxios.wait(function () {
            let request = moxios.requests.mostRecent();

            request.respondWith({
                status: 200,
                response: { data: {}}
            });
        });

        const expectedActions = [
            { type: `${types.FETCH_COMPARE}_PENDING` },
            { type: `${types.FETCH_COMPARE}_FULFILLED`, payload: { data: {}}}
        ];

        const store = mockStore({ fullCompareData: []});

        return store.dispatch(actions.fetchCompare()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('handles revertCompareData', () => {
        expect(compareActions.revertCompareData()).toEqual({
            type: types.REVERT_COMPARE_DATA
        });
    });

    it('handles clearComparison', () => {
        expect(compareActions.clearComparison()).toEqual({
            type: types.CLEAR_COMPARISON
        });
    });

    it('handles clearComparisonFilters', () => {
        expect(compareActions.clearComparisonFilters()).toEqual({
            type: types.CLEAR_COMPARISON_FILTERS
        });
    });

    it('handles setSelectedSystemIds empty', () => {
        expect(compareActions.setSelectedSystemIds([])).toEqual({
            type: types.SET_SELECTED_SYSTEM_IDS,
            payload: { selectedSystemIds: []}
        });
    });

    it('handles setSelectedSystemIds', () => {
        const selectedSystemIds = [ 'abcd', '1234' ];

        expect(compareActions.setSelectedSystemIds(selectedSystemIds)).toEqual({
            type: types.SET_SELECTED_SYSTEM_IDS,
            payload: { selectedSystemIds }
        });
    });

    it('handles toggleFactSort ASC', () => {
        expect(compareActions.toggleFactSort(ASC)).toEqual({
            type: types.TOGGLE_FACT_SORT,
            payload: DESC
        });
    });

    it('handles toggleFactSort DESC', () => {
        expect(compareActions.toggleFactSort(DESC)).toEqual({
            type: types.TOGGLE_FACT_SORT,
            payload: ASC
        });
    });

    it('handles toggleStateSort ASC', () => {
        expect(compareActions.toggleStateSort(ASC)).toEqual({
            type: types.TOGGLE_STATE_SORT,
            payload: DESC
        });
    });

    it('handles toggleStateSort DESC', () => {
        expect(compareActions.toggleStateSort(DESC)).toEqual({
            type: types.TOGGLE_STATE_SORT,
            payload: ''
        });
    });

    it('handles toggleStateSort none', () => {
        expect(compareActions.toggleStateSort('')).toEqual({
            type: types.TOGGLE_STATE_SORT,
            payload: ASC
        });
    });

    it('handles addStateFilter true', () => {
        const filterDataTrue = ({
            display: 'Same',
            filter: 'SAME',
            selected: true
        });

        const filterDataFalse = ({
            display: 'Same',
            filter: 'SAME',
            selected: false
        });

        expect(compareActions.addStateFilter(filterDataTrue)).toEqual({
            type: types.ADD_STATE_FILTER,
            payload: filterDataFalse
        });
    });

    it('handles addStateFilter false', () => {
        const filterDataTrue = ({
            display: 'Same',
            filter: 'SAME',
            selected: true
        });

        const filterDataFalse = ({
            display: 'Same',
            filter: 'SAME',
            selected: false
        });
        expect(compareActions.addStateFilter(filterDataFalse)).toEqual({
            type: types.ADD_STATE_FILTER,
            payload: filterDataTrue
        });
    });

    it('handles filterByFact', () => {
        expect(compareActions.filterByFact('filter')).toEqual({
            type: types.FILTER_BY_FACT,
            payload: 'filter'
        });
    });

    it('handles handleFactFilter', () => {
        expect(compareActions.handleFactFilter('filter')).toEqual({
            type: types.HANDLE_FACT_FILTER,
            payload: 'filter'
        });
    });

    it('handles clearAllFactFilters', () => {
        expect(compareActions.clearAllFactFilters()).toEqual({
            type: types.CLEAR_ALL_FACT_FILTERS
        });
    });

    it('handles updatePagination', () => {
        let pagination = {
            page: 1,
            perPage: 10
        };

        expect(compareActions.updatePagination(pagination)).toEqual({
            type: types.UPDATE_DRIFT_PAGINATION,
            payload: pagination
        });
    });

    it('handles exportToCSV', () => {
        expect(compareActions.exportToCSV()).toEqual({
            type: types.EXPORT_TO_CSV
        });
    });

    it('handles exportToJSON', () => {
        expect(compareActions.exportToJSON()).toEqual({
            type: types.EXPORT_TO_JSON
        });
    });

    it('handles expandRow', () => {
        expect(compareActions.expandRow('arch')).toEqual({
            type: types.EXPAND_ROW,
            payload: 'arch'
        });
    });

    it('handles resetComparisonFilters', () => {
        expect(compareActions.resetComparisonFilters()).toEqual({
            type: types.RESET_COMPARISON_FILTERS
        });
    });

    it('handles setGlobalFilterTags', () => {
        expect(compareActions.setGlobalFilterTags([ 'tag1', 'tag2' ])).toEqual({
            type: types.SET_GLOBAL_FILTER_TAGS,
            payload: [ 'tag1', 'tag2' ]
        });
    });

    it('handles setGlobalFilterTags empty', () => {
        expect(compareActions.setGlobalFilterTags()).toEqual({
            type: types.SET_GLOBAL_FILTER_TAGS,
            payload: []
        });
    });

    it('handles setGlobalFilterWorkloads', () => {
        expect(compareActions.setGlobalFilterWorkloads([ 'workload1', 'workload2' ])).toEqual({
            type: types.SET_GLOBAL_FILTER_WORKLOADS,
            payload: [ 'workload1', 'workload2' ]
        });
    });

    it('handles setGlobalFilterWorkloads empty', () => {
        expect(compareActions.setGlobalFilterWorkloads()).toEqual({
            type: types.SET_GLOBAL_FILTER_WORKLOADS,
            payload: []
        });
    });

    it('handles setGlobalFilterSIDs', () => {
        expect(compareActions.setGlobalFilterSIDs([ 'SID1', 'SID2' ])).toEqual({
            type: types.SET_GLOBAL_FILTER_SIDS,
            payload: [ 'SID1', 'SID2' ]
        });
    });

    it('handles setGlobalFilterSIDs empty', () => {
        expect(compareActions.setGlobalFilterSIDs()).toEqual({
            type: types.SET_GLOBAL_FILTER_SIDS,
            payload: []
        });
    });
});
