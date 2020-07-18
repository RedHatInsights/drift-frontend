import baselinesTableReducer from '../baselinesTableReducer';
import baselinesFixtures from './baselinesTableReducer.fixtures';
import types from '../types';

describe('baselines table reducer', () => {
    let checkboxTableReducer = baselinesTableReducer('CHECKBOX');

    it('should return initial state', () => {
        expect(checkboxTableReducer(undefined, {})).toEqual({
            loading: false,
            baselineTableData: [],
            selectedBaselineIds: [],
            IdToDelete: '',
            emptyState: false,
            baselineError: {},
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
                totalBaselines: 0
            }, {
                type: `${types.FETCH_BASELINE_LIST}_CHECKBOX_FULFILLED`,
                payload: baselinesFixtures.baselinesListPayload
            })
        ).toEqual({
            loading: false,
            baselineTableData: baselinesFixtures.baselineTableDataRows,
            emptyState: false,
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
            baselineTableData: [],
            emptyState: true,
            totalBaselines: 0
        });
    });

    it('should handle FETCH_BASELINE_LIST_FULFILLED with selected baselines', () => {
        let newRowsWithOneSelected = [ ...baselinesFixtures.baselineTableDataRows ];
        newRowsWithOneSelected[0].selected = true;

        let output = checkboxTableReducer({
            loading: true,
            selectedBaselineIds: [ '1234' ]
        }, {
            type: `${types.FETCH_BASELINE_LIST}_CHECKBOX_FULFILLED`,
            payload: baselinesFixtures.baselinesListPayload
        });

        expect(output).toMatchObject({
            baselineTableData: newRowsWithOneSelected,
            emptyState: false,
            loading: false,
            selectedBaselineIds: [ '1234' ],
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
                selectedBaselineIds: []
            }, {
                type: `${types.SELECT_BASELINE}_CHECKBOX`,
                payload: {
                    ids: [ oneSelectedBaseline[0] ],
                    isSelected: true
                }
            })
        ).toEqual({
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
                selectedBaselineIds: oneSelectedBaseline
            }, {
                type: `${types.SELECT_BASELINE}_CHECKBOX`,
                payload: {
                    ids: [ twoSelectedBaselines[1] ],
                    isSelected: true
                }
            })
        ).toEqual({
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
                selectedBaselineIds: twoSelectedBaselines
            }, {
                type: `${types.SELECT_BASELINE}_CHECKBOX`,
                payload: {
                    ids: [ twoSelectedBaselines[1] ],
                    isSelected: false
                }
            })
        ).toEqual({
            baselineTableData: newRowsWithOneDeselected,
            selectedBaselineIds: oneSelectedBaseline
        });
    });

    it('should handle SET_SELECTED_BASELINES', () => {
        expect(
            checkboxTableReducer({
                selectedBaselineIds: [],
                baselineTableData: baselinesFixtures.baselineTableDataRows,
                totalBaselines: 2
            }, {
                type: `${types.SET_SELECTED_BASELINES}_CHECKBOX`,
                payload: [ '1234', 'abcd' ]
            })
        ).toEqual({
            baselineTableData: baselinesFixtures.baselineTableDataTwoSelected(),
            selectedBaselineIds: [ '1234', 'abcd' ],
            totalBaselines: 2
        });
    });
});
