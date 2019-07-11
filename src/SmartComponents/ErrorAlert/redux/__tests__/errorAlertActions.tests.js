import types from '../types';
import { errorAlertActions } from '../index';

describe('error alert actions', () => {
    it('toggleErrorAlert', () => {
        expect(errorAlertActions.toggleErrorAlert()).toEqual({
            type: types.OPEN_ERROR_ALERT
        });
    });
});
