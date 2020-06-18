import baselinesTableReducer from '../baselinesTableReducer';
import baselinesFixtures from './baselinesTableReducer.fixtures';
import types from '../types';

describe('baselines table reducer', () => {
    let checkboxTableReducer = baselinesTableReducer('CHECKBOX');

    it('should return initial state', () => {
        expect(checkboxTableReducer(undefined, {})).toEqual({
            loading: false,
            fullBaselineListData: [],
            baselineTableData: [],
            selectedBaselineIds: [],
            IdToDelete: '',
            emptyState: false,
            baselineError: {},
            page: 1,
            perPage: 50,
            totalBaselines: 0
        });
    });

    it('should handle FETCH_BASELINE_LIST_PENDING', () => {
        expect(
            checkboxTableReducer({ loading: false }, {
                type: `${types.FETCH_BASELINE_LIST}_CHECKBOX_PENDING`
            })
        ).toEqual({
            loading: true
        });
    });

    it('should handle FETCH_BASELINE_LIST_FULFILLED', () => {
        expect(
            checkboxTableReducer({
                loading: true,
                page: 1,
                perPage: 50,
                totalBaselines: 0
            }, {
                type: `${types.FETCH_BASELINE_LIST}_CHECKBOX_FULFILLED`,
                payload: baselinesFixtures.baselinesListPayload
            })
        ).toEqual({
            loading: false,
            fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
            baselineTableData: baselinesFixtures.baselineTableDataRows,
            emptyState: false,
            page: 1,
            perPage: 50,
            totalBaselines: 2
        });
    });

    it('should handle FETCH_BASELINE_LIST_FULFILLED empty', () => {
        expect(
            checkboxTableReducer({ loading: true }, {
                type: `${types.FETCH_BASELINE_LIST}_CHECKBOX_FULFILLED`,
                payload: baselinesFixtures.baselinesListEmptyPayload
            })
        ).toEqual({
            loading: false,
            fullBaselineListData: [],
            baselineTableData: [],
            emptyState: true,
            totalBaselines: 0
        });
    });

    it('should handle FETCH_BASELINE_LIST_FULFILLED with selected baselines', () => {
        let newRowsWithOneSelected = baselinesFixtures.baselineTableDataRows;
        newRowsWithOneSelected[0].selected = true;

        expect(
            checkboxTableReducer({
                loading: true,
                selectedBaselineIds: [ '1234' ],
                page: 1,
                perPage: 50
            }, {
                type: `${types.FETCH_BASELINE_LIST}_CHECKBOX_FULFILLED`,
                payload: baselinesFixtures.baselinesListPayload
            })
        ).toEqual({
            loading: false,
            fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
            baselineTableData: newRowsWithOneSelected,
            selectedBaselineIds: [ '1234' ],
            emptyState: false,
            page: 1,
            perPage: 50,
            totalBaselines: 2
        });
    });

    it('should handle SELECT_BASELINE one selected: true', () => {
        let newRowsWithOneSelected = baselinesFixtures.baselineTableDataRows;
        newRowsWithOneSelected[0].selected = true;

        let oneSelectedBaseline = [];
        oneSelectedBaseline.push(baselinesFixtures.baselinesListPayloadResults[0].id);

        expect(
            checkboxTableReducer({
                baselineTableData: baselinesFixtures.baselineTableDataRows,
                fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
                selectedBaselineIds: []
            }, {
                type: `${types.SELECT_BASELINE}_CHECKBOX`,
                payload: {
                    ids: [ oneSelectedBaseline[0] ],
                    isSelected: true
                }
            })
        ).toEqual({
            fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
            baselineTableData: newRowsWithOneSelected,
            selectedBaselineIds: oneSelectedBaseline
        });
    });

    it('should handle SELECT_BASELINE two selected: true', () => {
        let newRowsWithOneSelected = baselinesFixtures.baselineTableDataRows;
        newRowsWithOneSelected[0].selected = true;
        let newRowsWithTwoSelected = newRowsWithOneSelected;
        newRowsWithTwoSelected[1].selected = true;

        let oneSelectedBaseline = [];
        oneSelectedBaseline.push(baselinesFixtures.baselinesListPayloadResults[0].id);
        let twoSelectedBaselines = oneSelectedBaseline;
        twoSelectedBaselines.push(baselinesFixtures.baselinesListPayloadResults[1].id);

        expect(
            checkboxTableReducer({
                baselineTableData: newRowsWithOneSelected,
                fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
                selectedBaselineIds: oneSelectedBaseline
            }, {
                type: `${types.SELECT_BASELINE}_CHECKBOX`,
                payload: {
                    ids: [ twoSelectedBaselines[1] ],
                    isSelected: true
                }
            })
        ).toEqual({
            fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
            baselineTableData: newRowsWithTwoSelected,
            selectedBaselineIds: twoSelectedBaselines
        });
    });

    it('should handle SELECT_BASELINE selected: false', () => {
        let newRowsWithOneSelected = baselinesFixtures.baselineTableDataRows;
        newRowsWithOneSelected[0].selected = true;
        let newRowsWithTwoSelected = newRowsWithOneSelected;
        newRowsWithTwoSelected[1].selected = true;
        let newRowsWithOneDeselected = newRowsWithOneSelected;
        newRowsWithOneDeselected[1].selected = false;

        let twoSelectedBaselines = [];
        twoSelectedBaselines.push(baselinesFixtures.baselinesListPayloadResults[0].id);
        twoSelectedBaselines.push(baselinesFixtures.baselinesListPayloadResults[1].id);
        let oneSelectedBaseline = [];
        oneSelectedBaseline.push(baselinesFixtures.baselinesListPayloadResults[0].id);

        expect(
            checkboxTableReducer({
                baselineTableData: newRowsWithTwoSelected,
                fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
                selectedBaselineIds: twoSelectedBaselines
            }, {
                type: `${types.SELECT_BASELINE}_CHECKBOX`,
                payload: {
                    ids: [ twoSelectedBaselines[1] ],
                    isSelected: false
                }
            })
        ).toEqual({
            fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
            baselineTableData: newRowsWithOneDeselected,
            selectedBaselineIds: oneSelectedBaseline
        });
    });

    it('should handle SET_SELECTED_BASELINES', () => {
        expect(
            checkboxTableReducer({
                fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
                selectedBaselineIds: [],
                page: 1,
                perPage: 50
            }, {
                type: `${types.SET_SELECTED_BASELINES}_CHECKBOX`,
                payload: [ '1234', 'abcd' ]
            })
        ).toEqual({
            fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
            baselineTableData: baselinesFixtures.baselineTableDataTwoSelected(),
            selectedBaselineIds: [ '1234', 'abcd' ],
            page: 1,
            perPage: 50,
            totalBaselines: 2
        });
    });

    it('should handle UPDATE_BASELINES_PAGINATION page', () => {
        expect(
            checkboxTableReducer({
                fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
                page: 1,
                perPage: 1
            }, {
                type: `${types.UPDATE_BASELINES_PAGINATION}_CHECKBOX`,
                payload: { page: 2, perPage: 1 }
            })
        ).toEqual({
            fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
            baselineTableData: baselinesFixtures.baselineTableDataRow2,
            page: 2,
            perPage: 1,
            totalBaselines: 2
        });
    });

    it.skip('should handle UPDATE_BASELINES_PAGINATION per page', () => {
        expect(
            checkboxTableReducer({
                fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
                page: 1,
                perPage: 1
            }, {
                type: `${types.UPDATE_BASELINES_PAGINATION}_CHECKBOX`,
                payload: { page: 1, perPage: 2 }
            })
        ).toStrictEqual({
            fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
            baselineTableData: baselinesFixtures.baselineTableDataRows,
            page: 1,
            perPage: 2,
            totalBaselines: 2
        });
    });
});
