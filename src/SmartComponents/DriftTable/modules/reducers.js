import types from './types';

const initialState = {
    compare: {},
    status: {}
};

function compareReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.FETCH_COMPARE}_FULFILLED`:
            return {
                ...state,
                compare: action.payload
            };

        default:
            return {
                ...state
            };
    }
}

function statusReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.FETCH_STATUS}_FULFILLED`:
            return {
                ...state,
                status: action.payload
            };

        default:
            return {
                ...state
            };
    }
}

export default {
    compareReducer,
    statusReducer
};
