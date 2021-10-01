import { editBaselineActions } from '../index';
import types from '../types';
import fixtures from '../../EditBaseline/__tests__/helpers.fixtures';

describe('compare actions', () => {
    it('handles exportToCSV', () => {
        expect(editBaselineActions.exportToCSV(fixtures.mockBaselineData1, fixtures.mockBaselineTableData1)).toEqual({
            type: types.EXPORT_BASELINE_DATA_TO_CSV,
            payload: {
                type: 'csv',
                exportType: 'baselines data',
                baselineRowData: fixtures.mockBaselineTableData1,
                exportData: fixtures.mockBaselineData1
            }
        });
    });

    it('handles exportToJSON', () => {
        expect(editBaselineActions.exportToJSON(fixtures.mockBaselineTableData1)).toEqual({
            type: types.EXPORT_BASELINE_DATA_TO_JSON,
            payload: {
                type: 'json',
                exportType: 'baselines data',
                exportData: fixtures.mockBaselineTableData1
            }
        });
    });
});
