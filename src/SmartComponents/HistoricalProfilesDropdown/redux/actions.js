import types from './types';

function selectHistoricProfile(historicProfileId) {
    return {
        type: types.SELECT_HISTORIC_PROFILE,
        payload: historicProfileId
    };
}

export default {
    selectHistoricProfile
};
