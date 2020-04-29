import types from '../modules/types';

function selectSingleHSP(profile) {
    return {
        type: types.SELECT_SINGLE_HSP,
        payload: profile
    };
}

export default {
    selectSingleHSP
};
