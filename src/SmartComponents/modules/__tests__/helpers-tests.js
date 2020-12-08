import helpers from '../helpers';
import stateFiltersFixtures from './state-filter.fixtures';

describe('helpers', () => {
    it('it should return SAME filter selected true getStateSelected', () => {
        const state = 'SAME';
        const stateFilters = stateFiltersFixtures.sameStateTrue;
        expect(helpers.getStateSelected(state, stateFilters)).toEqual(stateFiltersFixtures.sameStateTrue[0]);
    });

    it('it should return undefined when state is not selected', () => {
        const state = 'SAME';
        const stateFilters = stateFiltersFixtures.allStatesFalse;
        expect(helpers.getStateSelected(state, stateFilters)).toEqual(undefined);
    });

    it('it should return SAME filter true getState', () => {
        const state = 'SAME';
        const stateFilters = stateFiltersFixtures.sameStateTrue;
        expect(helpers.getState(state, stateFilters)).toEqual(stateFiltersFixtures.sameStateTrue[0]);
    });

    it('it should return SAME filter false getState', () => {
        const state = 'SAME';
        const stateFilters = stateFiltersFixtures.sameStateFalse;
        expect(helpers.getState(state, stateFilters)).toEqual(stateFiltersFixtures.sameStateFalse[0]);
    });

    it('it should set tooltip when reference set', () => {
        const data = { name: 'system1', state: 'DIFFERENT' };
        const referenceId = 'abcd-1234-efgh-5678';
        helpers.setTooltip(data, stateFiltersFixtures.allStatesTrue, referenceId);
        expect(data.tooltip).toEqual('Different - At least one system fact value in this row differs from the reference.');
    });
});
/*eslint-enable camelcase*/
