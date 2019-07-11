import types from '../types';
import { filterDropdownActions } from '../index';

describe('filter dropdown actions', () => {
    it('toggleFilterDropDown', () => {
        expect(filterDropdownActions.toggleFilterDropDown()).toEqual({
            type: types.OPEN_FILTER_DROPDOWN
        });
    });
});
