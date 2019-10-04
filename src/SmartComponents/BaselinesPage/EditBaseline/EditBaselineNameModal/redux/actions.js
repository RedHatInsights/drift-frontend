import types from './types';

function toggleEditNameModal() {
    return {
        type: types.TOGGLE_EDIT_NAME_MODAL
    };
}

export default {
    toggleEditNameModal
};
