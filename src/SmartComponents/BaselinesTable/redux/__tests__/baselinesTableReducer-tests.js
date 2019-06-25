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
});
