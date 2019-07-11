import types from '../types';
import { actionKebabActions } from '../index';

describe('action kebab actions', () => {
    it('toggleKebab', () => {
        expect(actionKebabActions.toggleKebab()).toEqual({
            type: types.TOGGLE_KEBAB
        });
    });
});
