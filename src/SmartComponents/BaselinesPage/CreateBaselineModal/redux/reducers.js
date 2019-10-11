import types from './types';

const initialState = {
    createBaselineModalOpened: false,
    baselineData: undefined,
    error: {}
};

export function createBaselineModalReducer(state = initialState, action) {
    let response = '';
    let errorObject = {};

    switch (action.type) {
        case `${types.TOGGLE_CREATE_BASELINE_MODAL}`:
            return {
                ...state,
                createBaselineModalOpened: !state.createBaselineModalOpened,
                error: {}
            };
        case `${types.CREATE_BASELINE}_PENDING`:
            return {
                ...state,
                baselineDataLoading: true,
                error: {}
            };
        case `${types.CREATE_BASELINE}_FULFILLED`:
            return {
                ...state,
                baselineDataLoading: false,
                baselineData: action.payload
            };
        case `${types.CREATE_BASELINE}_REJECTED`:
            response = action.payload.response;

            if (response.data === '') {
                errorObject = { detail: response.statusText, status: response.status };
            } else if (response.data.message) {
                errorObject = { detail: response.data.message, status: response.status };
            } else {
                errorObject = { detail: response.data.detail, status: response.status };
            }

            return {
                ...state,
                baselineDataLoading: false,
                error: errorObject
            };

        default:
            return state;
    }
}
