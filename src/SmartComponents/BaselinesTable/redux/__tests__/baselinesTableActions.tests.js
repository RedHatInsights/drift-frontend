import { baselinesTableActions } from '../index';
import fixtures from './baselinesTableReducer.fixtures';

describe('baselines table actions', () => {
    it('fetchBaselines', () => {
        const promise = new Promise(() => {});

        expect(baselinesTableActions.fetchBaselines('CHECKBOX')).toEqual({
            type: `FETCH_BASELINE_LIST_CHECKBOX`,
            payload: promise
        });
    });

    it('selectBaseline equals', () => {
        expect(baselinesTableActions.selectBaseline([ '1', '2' ], true, 'CHECKBOX')).toEqual({
            type: `SELECT_BASELINE_CHECKBOX`,
            payload: {
                ids: [ '1', '2' ],
                isSelected: true
            }
        });
    });

    it('setSelectedBaselines without ids', () => {
        expect(baselinesTableActions.setSelectedBaselines([], 'CHECKBOX')).toEqual({
            type: `SET_SELECTED_BASELINES_CHECKBOX`,
            payload: []
        });
    });

    it('setSelectedBaselines with ids', () => {
        expect(baselinesTableActions.setSelectedBaselines([ 'abc', '123' ], 'CHECKBOX')).toEqual({
            type: `SET_SELECTED_BASELINES_CHECKBOX`,
            payload: [ 'abc', '123' ]
        });
    });

    it('handles exportToCSV', () => {
        expect(baselinesTableActions.exportToCSV(fixtures.baselineTableDataRows)).toEqual({
            type: `EXPORT_BASELINES_LIST_TO_CSV_CHECKBOX`,
            payload: {
                type: 'csv',
                exportType: 'baseline list',
                exportData: fixtures.baselineTableDataRows
            }
        });
    });

    it('handles exportToJSON', () => {
        expect(baselinesTableActions.exportToJSON(fixtures.baselineTableDataRows)).toEqual({
            type: `EXPORT_BASELINES_LIST_TO_JSON_CHECKBOX`,
            payload: {
                type: 'json',
                exportType: 'baseline list',
                exportData: fixtures.baselineTableDataRows
            }
        });
    });
});
