import { errorAlertReducer } from '../errorAlertReducer';
import types from '../types';

describe('error alert reducer', () => {
    it('should return initial state', () => {
        expect(errorAlertReducer(undefined, {})).toEqual(
            false
        );
    });

    it('should handle OPEN_ERROR_ALERT true', () => {
        expect(
            errorAlertReducer(false, {
                type: `${types.OPEN_ERROR_ALERT}`
            })
        ).toEqual(
            true
        );
    });

    it('should handle OPEN_ERROR_ALERT false', () => {
        expect(
            errorAlertReducer(true, {
                type: `${types.OPEN_ERROR_ALERT}`
            })
        ).toEqual(
            false
        );
    });
});
