import types from './types';

function toggleAddSystemModal() {
    return {
        type: types.OPEN_ADD_SYSTEM_MODAL
    };
}

export default {
    toggleAddSystemModal
};
