import types from './types';

const initialState = {
    creatingNewBaseline: false
};

export function baselinesPageReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.CREATE_NEW_BASELINE}`:
            return {
                ...state,
                creatingNewBaseline: !state.creatingNewBaseline
            };

        default:
            return state;
    }
}
