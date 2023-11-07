import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import moxios from 'moxios';

import actions from '../actions';
import types from '../types';

import { createBaselineModalActions } from '../index';

describe('create baseline modal actions', () => {
    const middlewares = [ promiseMiddleware ];
    const mockStore = configureMockStore(middlewares);

    beforeEach(function () {
        moxios.install();
    });

    afterEach(function () {
        moxios.uninstall();
    });

    it('creates CREATE_BASELINE_FULLFILLED when creation has been done', () => {
        moxios.wait(function () {
            let request = moxios.requests.mostRecent();

            request.respondWith({
                status: 200,
                response: { data: {}}
            });
        });

        const expectedActions = [
            { type: `${types.CREATE_BASELINE}_PENDING` },
            { type: `${types.CREATE_BASELINE}_FULFILLED`, payload: { data: {}}}
        ];

        const store = mockStore({ baselineData: []});

        return store.dispatch(actions.createBaseline()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('handles toggleCreateBaselineModal', () => {
        expect(createBaselineModalActions.toggleCreateBaselineModal()).toEqual({
            type: types.TOGGLE_CREATE_BASELINE_MODAL
        });
    });

    it('handles clearCreateBaselineData', () => {
        expect(createBaselineModalActions.clearCreateBaselineData()).toEqual({
            type: types.CLEAR_CREATE_BASELINE_DATA
        });
    });
});
