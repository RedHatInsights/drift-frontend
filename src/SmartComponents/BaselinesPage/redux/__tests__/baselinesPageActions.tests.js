import types from '../types';
import { baselinesPageActions } from '../index';

describe('baselines page actions', () => {
    it('toggleCreateBaseline', () => {
        expect(baselinesPageActions.toggleCreateBaseline()).toEqual({
            type: types.CREATE_NEW_BASELINE
        });
    });
});
