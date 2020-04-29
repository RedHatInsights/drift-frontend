import { createBaselineModalReducer } from '../reducers';
import types from '../types';

import createBaselineModalFixtures from './reducer.fixtures';

describe('compare reducer', () => {
    it('should return initial state', () => {
        expect(createBaselineModalReducer(undefined, {})).toEqual(
            {
                createBaselineModalOpened: false,
                baselineDataLoading: false,
                baselineData: undefined,
                error: {}
            }
        );
    });

    it('should handle TOGGLE_CREATE_BASELINE_MODAL', () => {
        expect(createBaselineModalReducer({
            createBaselineModalOpened: false
        }, {
            type: `${types.TOGGLE_CREATE_BASELINE_MODAL}`
        })).toEqual({
            createBaselineModalOpened: true,
            error: {}
        });
    });

    it('should handle CREATE_BASELINE_PENDING', () => {
        expect(createBaselineModalReducer({
            baselineDataLoading: false
        }, {
            type: `${types.CREATE_BASELINE}_PENDING`
        })).toEqual({
            baselineData: {},
            baselineDataLoading: true,
            error: {}
        });
    });

    it('should handle CREATE_BASELINE_FULFILLED', () => {
        expect(createBaselineModalReducer({
            baselineDataLoading: true
        }, {
            payload: createBaselineModalFixtures.baselineData,
            type: `${types.CREATE_BASELINE}_FULFILLED`
        })).toEqual({
            baselineDataLoading: false,
            baselineData: createBaselineModalFixtures.baselineData
        });
    });

    it('should handle CREATE_BASELINE_REJECTED with statusText', () => {
        let response = createBaselineModalFixtures.errorStatusText;

        expect(createBaselineModalReducer({}, {
            payload: response,
            type: `${types.CREATE_BASELINE}_REJECTED`
        })).toEqual({
            baselineDataLoading: false,
            error: { detail: response.response.statusText, status: response.response.status }
        });
    });

    it('should handle CREATE_BASELINE_REJECTED with message', () => {
        let response = createBaselineModalFixtures.errorDataMessage;

        expect(createBaselineModalReducer({}, {
            payload: response,
            type: `${types.CREATE_BASELINE}_REJECTED`
        })).toEqual({
            baselineDataLoading: false,
            error: { detail: response.response.data.message, status: response.response.status }
        });
    });

    it('should handle CREATE_BASELINE_REJECTED with detail', () => {
        let response = createBaselineModalFixtures.errorDataDetail;

        expect(createBaselineModalReducer({}, {
            payload: response,
            type: `${types.CREATE_BASELINE}_REJECTED`
        })).toEqual({
            baselineDataLoading: false,
            error: { detail: response.response.data.detail, status: response.response.status }
        });
    });
});
