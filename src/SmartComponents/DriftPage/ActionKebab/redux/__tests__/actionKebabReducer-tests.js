import { actionKebabReducer } from '../actionKebabReducer';
import types from '../types';

describe('action kebab reducer', () => {
    it('should return initial state', () => {
        expect(actionKebabReducer(undefined, {})).toEqual(
            false
        );
    });

    it('should handle TOGGLE_KEBAB true', () => {
        expect(
            actionKebabReducer(false, {
                type: `${types.TOGGLE_KEBAB}`
            })
        ).toEqual(
            true
        );
    });

    it('should handle TOGGLE_KEBAB false', () => {
        expect(
            actionKebabReducer(true, {
                type: `${types.TOGGLE_KEBAB}`
            })
        ).toEqual(
            false
        );
    });
});
