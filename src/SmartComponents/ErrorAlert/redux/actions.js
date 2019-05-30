import types from './types';

function toggleErrorAlert() {
    return {
        type: types.OPEN_ERROR_ALERT
    };
}

export default {
    toggleErrorAlert
};
