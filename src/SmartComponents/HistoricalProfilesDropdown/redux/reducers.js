import types from './types';

const initialState = {
    selectedHSPIds: []
};

export function historicProfilesReducer(state = initialState, action) {
    let newSelectedHSPIds = [];

    switch (action.type) {
        case types.SELECT_HISTORIC_PROFILE:
            newSelectedHSPIds = [ ...state.selectedHSPIds ];

            if (!newSelectedHSPIds.includes(action.payload)) {
                newSelectedHSPIds.push(action.payload);
            } else {
                for (let i = 0; i < newSelectedHSPIds.length; i++) {
                    if (newSelectedHSPIds[i] === action.payload) {
                        newSelectedHSPIds.splice(i, 1);
                    }
                }
            }

            return {
                ...state,
                selectedHSPIds: newSelectedHSPIds
            };

        default:
            return {
                ...state
            };
    }
}
