import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import moxios from 'moxios';

import actions from '../actions';
import types from '../types';

describe('compare actions', () => {
    const middlewares = [ promiseMiddleware() ];
    const mockStore = configureMockStore(middlewares);

    beforeEach(function () {
        moxios.install();
    });

    afterEach(function () {
        moxios.uninstall();
    });

    it('creates FETCH_COMPARE_FULLFILLED when fetching compare has been done', () => {
        moxios.wait(function () {
            let request = moxios.requests.mostRecent();

            request.respondWith({
                status: 200,
                response: { data: {}}
            });
        });

        const expectedActions = [
            { type: `${types.FETCH_COMPARE}_PENDING` },
            { type: `${types.FETCH_COMPARE}_FULFILLED`, payload: { data: {}}}
        ];

        const store = mockStore({ compare: []});

        return store.dispatch(actions.fetchCompare()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});
