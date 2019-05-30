import types from './types';

const initialState = {
    addSystemModalOpened: false
};

export function addSystemModalReducer(addSystemModalOpened = initialState.addSystemModalOpened, action) {
    switch (action.type) {
        case `${types.OPEN_ADD_SYSTEM_MODAL}`:
            return !addSystemModalOpened;

        default:
            return addSystemModalOpened;
    }
}
