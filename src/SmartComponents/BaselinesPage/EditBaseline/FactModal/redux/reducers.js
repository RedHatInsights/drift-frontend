import types from './types';

const initialState = {
    factModalOpened: false,
    factName: '',
    valueName: '',
    factData: []
};

export function factModalReducer(state = initialState, action) {
    switch (action.type) {
        case `${types.TOGGLE_FACT_MODAL}`:
            return {
                ...state,
                factModalOpened: !state.factModalOpened
            };
        case `${types.SET_FACT_DATA}`:
            return {
                ...state,
                factName: action.payload.factName,
                valueName: action.payload.valueName,
                factData: action.payload.fact
            };

        default:
            return state;
    }
}
