import types from './types';

const initialState = {
    errorAlertOpened: false
};

export function errorAlertReducer(errorAlertOpened = initialState.errorAlertOpened, action) {
    switch (action.type) {
        case `${types.OPEN_ERROR_ALERT}`:
            return !errorAlertOpened;

        default:
            return errorAlertOpened;
    }
}
