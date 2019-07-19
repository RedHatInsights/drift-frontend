import { baselinesPageReducer } from '../baselinesPageReducer';
import types from '../types';

describe('baselines page reducer', () => {
    it('should return initial state', () => {
        expect(baselinesPageReducer(undefined, {})).toEqual({
            creatingNewBaseline: false }
        );
    });

    it('should handle CREATE_NEW_BASELINE true', () => {
        expect(
            baselinesPageReducer({ creatingNewBaseline: false }, {
                type: `${types.CREATE_NEW_BASELINE}`
            })
        ).toEqual({
            creatingNewBaseline: true }
        );
    });

    it('should handle CREATE_NEW_BASELINE false', () => {
        expect(
            baselinesPageReducer({ creatingNewBaseline: true }, {
                type: `${types.CREATE_NEW_BASELINE}`
            })
        ).toEqual({
            creatingNewBaseline: false }
        );
    });
});
