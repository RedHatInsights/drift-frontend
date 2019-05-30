import types from './types';

const initialState = {
    filterDropdownOpened: false
};

export function filterDropdownReducer(filterDropdownOpened = initialState.filterDropdownOpened, action) {
    switch (action.type) {
        case `${types.OPEN_FILTER_DROPDOWN}`:
            return !filterDropdownOpened;

        default:
            return filterDropdownOpened;
    }
}
