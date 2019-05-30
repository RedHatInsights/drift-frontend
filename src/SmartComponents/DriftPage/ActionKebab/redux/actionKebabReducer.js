import types from './types';

const initialState = {
    kebabOpened: false
};

export function actionKebabReducer(kebabOpened = initialState.kebabOpened, action) {
    switch (action.type) {
        case `${types.TOGGLE_KEBAB}`:
            return !kebabOpened;
        default:
            return kebabOpened;
    }
}
