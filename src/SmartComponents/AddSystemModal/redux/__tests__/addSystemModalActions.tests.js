import types from '../types';
import addSystemModalActions from '../actions';

describe('add system modal actions', () => {
    it('toggleAddSystemModal', () => {
        expect(addSystemModalActions.toggleAddSystemModal()).toEqual({
            type: types.OPEN_ADD_SYSTEM_MODAL
        });
    });

    it('selectActiveTab baselines', () => {
        expect(addSystemModalActions.selectActiveTab(1)).toEqual({
            type: types.SELECT_ACTIVE_TAB,
            payload: 1
        });
    });

    it('selectActiveTab systems', () => {
        expect(addSystemModalActions.selectActiveTab(0)).toEqual({
            type: types.SELECT_ACTIVE_TAB,
            payload: 0
        });
    });
});
