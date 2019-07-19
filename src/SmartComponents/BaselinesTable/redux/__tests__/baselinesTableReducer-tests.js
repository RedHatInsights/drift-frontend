import { baselinesTableReducer } from '../baselinesTableReducer';
import baselinesFixtures from './baselinesTableReducer.fixtures';
import types from '../types';

describe('baselines table reducer', () => {
    it('should return initial state', () => {
        expect(baselinesTableReducer(undefined, {})).toEqual({
            loading: false,
            fullBaselineListData: [],
            baselineTableData: [],
            selectedBaselineIds: []
        });
    });

    it('should handle FETCH_BASELINE_LIST_PENDING', () => {
        expect(
            baselinesTableReducer({ loading: false }, {
                type: `${types.FETCH_BASELINE_LIST}_PENDING`
            })
        ).toEqual({
            loading: true }
        );
    });

    it('should handle FETCH_BASELINE_LIST_FULFILLED', () => {
        expect(
            baselinesTableReducer({ loading: true }, {
                type: `${types.FETCH_BASELINE_LIST}_FULFILLED`,
                payload: baselinesFixtures.baselinesListPayload
            })
        ).toEqual({
            loading: false,
            fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
            baselineTableData: baselinesFixtures.baselineTableDataRows
        });
    });

    it('should handle FETCH_BASELINE_LIST_FULFILLED with selected baselines', () => {
        let newRowsWithOneSelected = baselinesFixtures.baselineTableDataRows;
        newRowsWithOneSelected[0].selected = true;

        expect(
            baselinesTableReducer({ loading: true, selectedBaselineIds: [ '1234' ]}, {
                type: `${types.FETCH_BASELINE_LIST}_FULFILLED`,
                payload: baselinesFixtures.baselinesListPayload
            })
        ).toEqual({
            loading: false,
            fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
            baselineTableData: newRowsWithOneSelected,
            selectedBaselineIds: [ '1234' ]
        });
    });

    it('should handle SELECT_BASELINE one selected: true', () => {
        let newRowsWithOneSelected = baselinesFixtures.baselineTableDataRows;
        newRowsWithOneSelected[0].selected = true;

        let oneSelectedBaseline = [];
        oneSelectedBaseline.push(baselinesFixtures.baselinesListPayloadResults[0].id);

        expect(
            baselinesTableReducer({
                baselineTableData: baselinesFixtures.baselineTableDataRows,
                fullBaselineListData: baselinesFixtures.baselinesListPayloadResults
            }, {
                type: `${types.SELECT_BASELINE}`,
                payload: newRowsWithOneSelected
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
            baselinesTableReducer({
                baselineTableData: newRowsWithOneSelected,
                fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
                selectedBaselineIds: oneSelectedBaseline
            }, {
                type: `${types.SELECT_BASELINE}`,
                payload: newRowsWithTwoSelected
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
            baselinesTableReducer({
                baselineTableData: newRowsWithTwoSelected,
                fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
                selectedBaselineIds: twoSelectedBaselines
            }, {
                type: `${types.SELECT_BASELINE}`,
                payload: newRowsWithOneDeselected
            })
        ).toEqual({
            fullBaselineListData: baselinesFixtures.baselinesListPayloadResults,
            baselineTableData: newRowsWithOneDeselected,
            selectedBaselineIds: oneSelectedBaseline
        });
    });

    it('should handle SET_SELECTED_BASELINES', () => {
        expect(
            baselinesTableReducer({ selectedBaselineIds: []}, {
                type: `${types.SET_SELECTED_BASELINES}`,
                payload: [ '1234', 'abcd' ]
            })
        ).toEqual({
            selectedBaselineIds: [ '1234', 'abcd' ]
        });
    });

    it('should handle SET_SELECTED_BASELINES remove', () => {
        expect(
            baselinesTableReducer({ selectedBaselineIds: [ '1234', 'abcd' ]}, {
                type: `${types.SET_SELECTED_BASELINES}`,
                payload: [ '1234' ]
            })
        ).toEqual({
            selectedBaselineIds: [ '1234' ]
        });
    });
});
