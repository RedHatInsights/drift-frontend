import types from './types';

function selectHistoricProfiles(historicProfileIds) {
    return {
        type: types.SELECT_HISTORIC_PROFILES,
        payload: historicProfileIds
    };
}

function setSelectedHistoricProfiles(historicProfileIds) {
    return {
        type: types.SET_SELECTED_HISTORIC_PROFILES,
        payload: historicProfileIds
    };
}

export default {
    selectHistoricProfiles,
    setSelectedHistoricProfiles
};
