import { addSystemModalReducer } from '../addSystemModalReducer';
import types from '../types';

describe('add system modal reducer', () => {
    it('should return initial state', () => {
        expect(addSystemModalReducer(undefined, {})).toEqual(
            false
        );
    });

    it('should handle OPEN_ADD_SYSTEM_MODAL true', () => {
        expect(
            addSystemModalReducer(false, {
                type: `${types.OPEN_ADD_SYSTEM_MODAL}`
            })
        ).toEqual(
            true
        );
    });

    it('should handle OPEN_ADD_SYSTEM_MODAL false', () => {
        expect(
            addSystemModalReducer(true, {
                type: `${types.OPEN_ADD_SYSTEM_MODAL}`
            })
        ).toEqual(
            false
        );
    });
});
