/*eslint-disable camelcase*/
import types from '../types';
import { addSystemModalActions } from '../index';
import { BlueprintIcon, ClockIcon, ServerIcon } from '@patternfly/react-icons';

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

    it('handleSystemSelection true', () => {
        expect(addSystemModalActions.handleSystemSelection(
            [{ id: 'abcd1234', name: 'system', icon: <ServerIcon /> }],
            true
        )).toEqual({
            type: types.HANDLE_SYSTEM_SELECTION,
            payload: {
                content: [{ id: 'abcd1234', name: 'system', icon: <ServerIcon /> }],
                isSelected: true
            }
        });
    });

    it('handleBaselineSelection true', () => {
        expect(addSystemModalActions.handleBaselineSelection(
            [{ id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> }],
            true
        )).toEqual({
            type: types.HANDLE_BASELINE_SELECTION,
            payload: {
                content: [{ id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> }],
                isSelected: true
            }
        });
    });

    it('handleBaselineSelection false', () => {
        expect(addSystemModalActions.handleBaselineSelection(
            [{ id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> }],
            false
        )).toEqual({
            type: types.HANDLE_BASELINE_SELECTION,
            payload: {
                content: [{ id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> }],
                isSelected: false
            }
        });
    });

    it('handleHSPSelection true', () => {
        expect(addSystemModalActions.handleHSPSelection(
            [{ id: 'abcd1234', system_id: 'efgh5678', icon: <ClockIcon />, captured_date: '2021-03-03T06:40:32+00:00' }]
        )).toEqual({
            type: types.HANDLE_HSP_SELECTION,
            payload: [{ id: 'abcd1234', system_id: 'efgh5678', icon: <ClockIcon />, captured_date: '2021-03-03T06:40:32+00:00' }]
        });
    });

    it('should call CLEAR_ALL_SELECTIONS', () => {
        expect(addSystemModalActions.clearAllSelections()).toEqual({ type: types.CLEAR_ALL_SELECTIONS });
    });
});
/*eslint-enable camelcase*/
