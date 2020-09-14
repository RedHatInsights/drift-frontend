import types from './types';

function selectHistoricProfiles(historicProfileIds) {
    return {
        type: types.SELECT_HISTORIC_PROFILES,
        payload: historicProfileIds
    };
}

export default {
    selectHistoricProfiles
};
