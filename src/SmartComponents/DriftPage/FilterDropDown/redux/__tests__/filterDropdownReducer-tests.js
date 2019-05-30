import { filterDropdownReducer } from '../filterDropdownReducer';
import types from '../types';

describe('filter dropdown reducer', () => {
    it('should return initial state', () => {
        expect(filterDropdownReducer(undefined, {})).toEqual(
            false
        );
    });

    it('should handle OPEN_FILTER_DROPDOWN true', () => {
        expect(
            filterDropdownReducer(false, {
                type: `${types.OPEN_FILTER_DROPDOWN}`
            })
        ).toEqual(
            true
        );
    });

    it('should handle OPEN_FILTER_DROPDOWN false', () => {
        expect(
            filterDropdownReducer(true, {
                type: `${types.OPEN_FILTER_DROPDOWN}`
            })
        ).toEqual(
            false
        );
    });
});
