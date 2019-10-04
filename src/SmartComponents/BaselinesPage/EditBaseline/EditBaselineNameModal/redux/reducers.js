import types from './types';

const initialState = {
    editNameModalOpened: false
};

export function editNameModalReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.TOGGLE_EDIT_NAME_MODAL}`:
            return {
                ...state,
                editNameModalOpened: !state.editNameModalOpened
            };

        default:
            return state;
    }
}
