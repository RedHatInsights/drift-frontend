import types from '../modules/types';

function selectSingleHSP(profile) {
    return {
        type: types.SELECT_SINGLE_HSP,
        payload: profile
    };
}

function updateColumns(key) {
    return {
        type: types.UPDATE_COLUMNS,
        payload: key
    };
}

export default {
    selectSingleHSP,
    updateColumns
};
