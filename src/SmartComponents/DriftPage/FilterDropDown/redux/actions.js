import types from './types';

function toggleFilterDropDown() {
    return {
        type: types.OPEN_FILTER_DROPDOWN
    };
}

export default {
    toggleFilterDropDown
};
