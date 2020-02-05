import types from './types';

const initialState = {
    selectedHSPIds: []
};

export function historicProfilesReducer(state = initialState, action) {
    let newSelectedHSPIds = [];

    switch (action.type) {
        case types.SELECT_HISTORIC_PROFILES:
            newSelectedHSPIds = [ ...state.selectedHSPIds ];

            action.payload.forEach((hspId) => {
                if (!newSelectedHSPIds.includes(hspId)) {
                    newSelectedHSPIds.push(hspId);
                } else {
                    for (let i = 0; i < newSelectedHSPIds.length; i++) {
                        if (newSelectedHSPIds[i] === hspId) {
                            newSelectedHSPIds.splice(i, 1);
                        }
                    }
                }
            });

            return {
                ...state,
                selectedHSPIds: newSelectedHSPIds
            };
        case types.SET_SELECTED_HISTORIC_PROFILES:
            return {
                ...state,
                selectedHSPIds: action.payload
            };

        default:
            return {
                ...state
            };
    }
}
