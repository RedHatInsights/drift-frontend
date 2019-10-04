import types from './types';

const initialState = {
    createBaselineModalOpened: false
};

export function createBaselineModalReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.TOGGLE_CREATE_BASELINE_MODAL}`:
            return {
                ...state,
                createBaselineModalOpened: !state.createBaselineModalOpened
            };

        default:
            return state;
    }
}
