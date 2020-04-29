import types from './types';

const initialState = {
    selectedHSPIds: []
};

export function historicProfilesReducer(state = initialState, action) {
    //let newSelectedHSPIds = [];
    let id;
    let selected;

    switch (action.type) {
        case types.SELECT_HISTORIC_PROFILES:
            /*newSelectedHSPIds = [ ...state.selectedHSPIds ];

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
            });*/

            return {
                ...state,
                //selectedHSPIds: newSelectedHSPIds
                selectedHSPIds: action.payload
            };
        case types.SET_SELECTED_HISTORIC_PROFILES:
            return {
                ...state,
                selectedHSPIds: action.payload
            };
        case 'SELECT_ENTITY':
            id = action.payload.id;
            selected = action.payload.selected;

            return {
                ...state,
                selectedHSPIds: id === 0 && !selected ? [] : state.selectedHSPIds
            };

        default:
            return {
                ...state
            };
    }
}
