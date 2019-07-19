import types from './types';

function toggleCreateBaseline() {
    return {
        type: types.CREATE_NEW_BASELINE
    };
}

export default {
    toggleCreateBaseline
};
