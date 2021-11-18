/*eslint-disable camelcase*/
import { addSystemModalReducer } from '../addSystemModalReducer';
import types from '../types';
import { BlueprintIcon, ClockIcon, ServerIcon } from '@patternfly/react-icons';
import DriftTooltip from '../../../DriftTooltip/DriftTooltip';
import addSystemModalFixtures from './addSystemModalReducer.fixtures';

describe('add system modal reducer', () => {
    it('should return initial state', () => {
        expect(addSystemModalReducer(undefined, {})).toEqual({
            addSystemModalOpened: false,
            activeTab: 0,
            selectedSystemIds: [],
            selectedSystemContent: [],
            selectedBaselineContent: [],
            selectedHSPContent: []}
        );
    });

    it('should handle OPEN_ADD_SYSTEM_MODAL true', () => {
        expect(
            addSystemModalReducer({ addSystemModalOpened: false }, {
                type: `${types.OPEN_ADD_SYSTEM_MODAL}`
            })
        ).toEqual({
            addSystemModalOpened: true }
        );
    });

    it('should handle OPEN_ADD_SYSTEM_MODAL false', () => {
        expect(
            addSystemModalReducer({ addSystemModalOpened: true }, {
                type: `${types.OPEN_ADD_SYSTEM_MODAL}`
            })
        ).toEqual({
            addSystemModalOpened: false }
        );
    });

    it('should handle SELECT_ACTIVE_TAB 1', () => {
        expect(
            addSystemModalReducer({ activeTab: 0 }, {
                type: `${types.SELECT_ACTIVE_TAB}`,
                payload: 1
            })
        ).toEqual({
            activeTab: 1 }
        );
    });

    it('should handle SELECT_ACTIVE_TAB 0', () => {
        expect(
            addSystemModalReducer({ activeTab: 1 }, {
                type: `${types.SELECT_ACTIVE_TAB}`,
                payload: 0
            })
        ).toEqual({
            activeTab: 0 }
        );
    });

    it('should handle HANDLE_SYSTEM_SELECTION add system', () => {
        expect(
            addSystemModalReducer({ selectedSystemContent: []}, {
                type: `${types.HANDLE_SYSTEM_SELECTION}`,
                payload: {
                    content: [{ id: 'abcd1234', name: 'system', icon: <ServerIcon /> }],
                    isSelected: true
                }
            })
        ).toEqual({
            selectedSystemContent: [
                { id: 'abcd1234', name: 'system', icon: <ServerIcon /> }
            ]}
        );
    });

    it('should handle HANDLE_SYSTEM_SELECTION add multiple systems', () => {
        expect(
            addSystemModalReducer({ selectedSystemContent: []}, {
                type: `${types.HANDLE_SYSTEM_SELECTION}`,
                payload: {
                    content: [
                        { id: 'abcd1234', name: 'system', icon: <ServerIcon /> },
                        { id: 'efgh5678', name: 'another_system', icon: <ServerIcon /> }
                    ],
                    isSelected: true
                }
            })
        ).toEqual({
            selectedSystemContent: [
                { id: 'abcd1234', name: 'system', icon: <ServerIcon /> },
                { id: 'efgh5678', name: 'another_system', icon: <ServerIcon /> }
            ]}
        );
    });

    it('should handle HANDLE_SYSTEM_SELECTION remove system', () => {
        expect(
            addSystemModalReducer({
                selectedSystemContent: [
                    { id: 'abcd1234', name: 'system', icon: <ServerIcon /> }
                ]
            }, {
                type: `${types.HANDLE_SYSTEM_SELECTION}`,
                payload: {
                    content: [{ id: 'abcd1234', name: 'system', icon: <ServerIcon /> }],
                    isSelected: false
                }
            })
        ).toEqual({
            selectedSystemContent: []}
        );
    });

    it('should handle HANDLE_SYSTEM_SELECTION remove 1 of 2 systems', () => {
        expect(
            addSystemModalReducer({
                selectedSystemContent: [
                    { id: 'abcd1234', name: 'system', icon: <ServerIcon /> },
                    { id: 'efgh5678', name: 'another_system', icon: <ServerIcon /> }
                ]
            }, {
                type: `${types.HANDLE_SYSTEM_SELECTION}`,
                payload: {
                    content: [{ id: 'abcd1234', name: 'system', icon: <ServerIcon /> }],
                    isSelected: false
                }
            })
        ).toEqual({
            selectedSystemContent: [
                { id: 'efgh5678', name: 'another_system', icon: <ServerIcon /> }
            ]}
        );
    });

    it('should handle HANDLE_BASELINE_SELECTION add baseline', () => {
        expect(
            addSystemModalReducer({ selectedBaselineContent: []}, {
                type: `${types.HANDLE_BASELINE_SELECTION}`,
                payload: {
                    content: [{ id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> }],
                    isSelected: true
                }
            })
        ).toEqual({
            selectedBaselineContent: [
                { id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> }
            ]}
        );
    });

    it('should handle HANDLE_BASELINE_SELECTION add multiple baselines', () => {
        expect(
            addSystemModalReducer({ selectedBaselineContent: []}, {
                type: `${types.HANDLE_BASELINE_SELECTION}`,
                payload: {
                    content: [
                        { id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> },
                        { id: 'efgh5678', name: 'another_baseline', icon: <BlueprintIcon /> }
                    ],
                    isSelected: true
                }
            })
        ).toEqual({
            selectedBaselineContent: [
                { id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> },
                { id: 'efgh5678', name: 'another_baseline', icon: <BlueprintIcon /> }
            ]}
        );
    });

    it('should handle HANDLE_BASELINE_SELECTION remove baseline', () => {
        expect(
            addSystemModalReducer({
                selectedBaselineContent: [
                    { id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> }
                ]
            }, {
                type: `${types.HANDLE_BASELINE_SELECTION}`,
                payload: {
                    content: [{ id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> }],
                    isSelected: false
                }
            })
        ).toEqual({
            selectedBaselineContent: []}
        );
    });

    it('should handle HANDLE_BASELINE_SELECTION remove 1 of 2 baseline', () => {
        expect(
            addSystemModalReducer({
                selectedBaselineContent: [
                    { id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> },
                    { id: 'efgh5678', name: 'another_baseline', icon: <BlueprintIcon /> }
                ]
            }, {
                type: `${types.HANDLE_BASELINE_SELECTION}`,
                payload: {
                    content: [{ id: 'abcd1234', name: 'baseline', icon: <BlueprintIcon /> }],
                    isSelected: false
                }
            })
        ).toEqual({
            selectedBaselineContent: [
                { id: 'efgh5678', name: 'another_baseline', icon: <BlueprintIcon /> }
            ]}
        );
    });

    it('should handle HANDLE_HSP_SELECTION add hsp', () => {
        expect(
            addSystemModalReducer({ selectedHSPContent: []}, {
                type: `${types.HANDLE_HSP_SELECTION}`,
                payload: {
                    id: 'abcd1234',
                    system_id: 'efgh5678',
                    icon: <DriftTooltip
                        content='Historical profile'
                        body={ <ClockIcon /> }
                    />,
                    captured_date: '2021-03-03T06:40:32+00:00'
                }
            })
        ).toEqual({
            selectedHSPContent: [
                {
                    id: 'abcd1234',
                    system_id: 'efgh5678',
                    icon: <DriftTooltip
                        content='Historical profile'
                        body={ <ClockIcon /> }
                    />,
                    captured_date: '2021-03-03T06:40:32+00:00'
                }
            ]}
        );
    });

    it('should handle HANDLE_HSP_SELECTION remove hsp', () => {
        expect(
            addSystemModalReducer({
                selectedHSPContent: [
                    {
                        id: 'abcd1234',
                        system_id: 'efgh5678',
                        icon: <DriftTooltip
                            content='Historical profile'
                            body={ <ClockIcon /> }
                        />,
                        captured_date: '2021-03-03T06:40:32+00:00'
                    }
                ]
            }, {
                type: `${types.HANDLE_HSP_SELECTION}`,
                payload: {
                    id: 'abcd1234',
                    system_id: 'efgh5678',
                    icon: <DriftTooltip
                        content='Historical profile'
                        body={ <ClockIcon /> }
                    />,
                    captured_date: '2021-03-03T06:40:32+00:00'
                }
            })
        ).toEqual({
            selectedHSPContent: []}
        );
    });

    it('should handle HANDLE_HSP_SELECTION add second hsp', () => {
        expect(
            addSystemModalReducer({
                selectedHSPContent: [
                    {
                        id: 'abcd1234',
                        system_id: 'efgh5678',
                        icon: <DriftTooltip
                            content='Historical profile'
                            body={ <ClockIcon /> }
                        />,
                        captured_date: '2021-03-03T06:40:32+00:00'
                    }
                ]
            }, {
                type: `${types.HANDLE_HSP_SELECTION}`,
                payload: {
                    id: 'ijkl9101',
                    system_id: 'efgh5678',
                    icon: <DriftTooltip
                        content='Historical profile'
                        body={ <ClockIcon /> }
                    />,
                    captured_date: '2021-03-02T06:40:32+00:00'
                }
            })
        ).toEqual({
            selectedHSPContent: [
                {
                    id: 'abcd1234',
                    system_id: 'efgh5678',
                    icon: <DriftTooltip
                        content='Historical profile'
                        body={ <ClockIcon /> }
                    />,
                    captured_date: '2021-03-03T06:40:32+00:00'
                },
                {
                    id: 'ijkl9101',
                    system_id: 'efgh5678',
                    icon: <DriftTooltip
                        content='Historical profile'
                        body={ <ClockIcon /> }
                    />,
                    captured_date: '2021-03-02T06:40:32+00:00'
                }
            ]}
        );
    });

    it('should handle CLEAR_ALL_SELECTIONS', () => {
        expect(
            addSystemModalReducer({
                selectedSystemContent: addSystemModalFixtures.systemContent3,
                selectedBaselineContent: addSystemModalFixtures.baselineContent3,
                selectedHSPContent: addSystemModalFixtures.hspContent3
            }, {
                type: `${types.CLEAR_ALL_SELECTIONS}`
            })
        ).toEqual({
            selectedSystemContent: [],
            selectedBaselineContent: [],
            selectedHSPContent: []
        });
    });
});
/*eslint-enable camelcase*/
