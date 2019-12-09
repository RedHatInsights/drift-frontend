import types from './types';

const initialState = {
    selectedPITIds: []
};

export function historicProfilesReducer(state = initialState, action) {
    let newSelectedPITIds = [];

    switch (action.type) {
        case types.SELECT_HISTORIC_PROFILE:
            newSelectedPITIds = [ ...state.selectedPITIds ];

            if (!newSelectedPITIds.includes(action.payload)) {
                newSelectedPITIds.push(action.payload);
            } else {
                for (let i = 0; i < newSelectedPITIds.length; i++) {
                    if (newSelectedPITIds[i] === action.payload) {
                        newSelectedPITIds.splice(i, 1);
                    }
                }
            }

            return {
                ...state,
                selectedPITIds: newSelectedPITIds
            };

        default:
            return {
                ...state
            };
    }
}
