import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import actions from '../actions';
import types from '../types';

import { createBaselineModalActions } from '../index';
import { waitFor } from '@testing-library/dom';

const axiosMock = new MockAdapter(axios);

axiosMock.onPost().reply(200, {
    data: {}
});

describe('create baseline modal actions', () => {
    const middlewares = [ promiseMiddleware ];
    const mockStore = configureMockStore(middlewares);

    it('creates CREATE_BASELINE_FULLFILLED when creation has been done', async () => {
        const expectedActions = [
            { type: `${types.CREATE_BASELINE}_PENDING` },
            { type: `${types.CREATE_BASELINE}_FULFILLED`, payload: { data: {}}}
        ];

        const store = mockStore({ baselineData: []});

        store.dispatch(actions.createBaseline());
        await waitFor(() => expect(store.getActions()).toEqual(expectedActions));
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
