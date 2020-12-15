import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';
import _ from 'lodash';

import ConnectedCreateBaselineModal, { CreateBaselineModal } from '../CreateBaselineModal';

describe('CreateBaselineModal', () => {
    let props;

    beforeEach(() => {
        props = {
            createBaselineModalOpened: false,
            baselineData: [],
            entities: {},
            selectedBaselineIds: [],
            createBaselineError: {},
            clearSelectedBaselines: jest.fn(),
            handleChecked: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render correctly', () =>{
        const wrapper = shallow(
            <CreateBaselineModal { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render mount correctly', () =>{
        const wrapper = mount(
            <CreateBaselineModal { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should render modal opened', () => {
            props.createBaselineModalOpened = true;
            const wrapper = mount(
                <CreateBaselineModal { ...props }/>
            );

            expect(wrapper.find('Modal').prop('isOpen')).toEqual(true);
        });

        it('should use handleChecked', () => {
            const event = { currentTarget: { value: 'copyBaselineChecked' }};
            props.createBaselineModalOpened = true;
            const wrapper = shallow(
                <CreateBaselineModal { ...props }/>
            );

            /*eslint-disable no-undef*/
            wrapper.find('[id="copy baseline"]').simulate('change', _, event);
            expect(wrapper.state('copyBaselineChecked')).toEqual(true);

            event.currentTarget.value = 'copySystemChecked';
            wrapper.find('[id="copy system"]').simulate('change', _, event);
            expect(wrapper.state('copySystemChecked')).toEqual(true);

            event.currentTarget.value = 'fromScratchChecked';
            wrapper.find('[id="create baseline"]').simulate('change', _, event);
            expect(wrapper.state('fromScratchChecked')).toEqual(true);
            /*eslint-enable no-undef*/
        });

        it('should update baselineName', () => {
            const event = 'baseline';
            props.createBaselineModalOpened = true;
            const wrapper = shallow(
                <CreateBaselineModal { ...props }/>
            );

            wrapper.find('[aria-label="baseline name"]').simulate('change', event);
            expect(wrapper.state('baselineName')).toEqual('baseline');
        });

        it('should submit baselineName with copyBaselineChecked', () => {
            props.createBaselineModalOpened = true;
            props.selectedBaselineIds = [ 'abcd' ];
            const createBaseline = jest.fn();
            const wrapper = mount(
                <CreateBaselineModal { ...props }
                    createBaseline={ createBaseline }
                />
            );

            wrapper.setState({ baselineName: 'baseline' });

            wrapper.find('.pf-c-button').at(1).simulate('click');
            expect(createBaseline).toHaveBeenCalledTimes(1);
        });

        it('should render global filter alert', () => {
            const event = { currentTarget: { value: 'copySystemChecked' }};
            props.createBaselineModalOpened = true;
            const wrapper = shallow(
                <CreateBaselineModal { ...props }/>
            );

            expect(wrapper.find('GlobalFilterAlert')).toHaveLength(0);

            /*eslint-disable no-undef*/
            event.currentTarget.value = 'copySystemChecked';
            wrapper.find('[id="copy system"]').simulate('change', _, event);
            /*eslint-enable no-undef*/

            expect(wrapper.find('GlobalFilterAlert')).toHaveLength(1);
        });
    });

    it('should cancelModal', () => {
        props.createBaselineModalOpened = true;
        const toggleCreateBaselineModal = jest.fn();
        const wrapper = mount(
            <CreateBaselineModal { ...props }
                toggleCreateBaselineModal={ toggleCreateBaselineModal }
            />
        );

        wrapper.find('.pf-c-button').at(2).simulate('click');
        expect(toggleCreateBaselineModal).toHaveBeenCalledTimes(1);
    });

    it('should submit baseline name on key press', () => {
        props.createBaselineModalOpened = true;
        const createBaseline = jest.fn();
        const wrapper = mount(
            <CreateBaselineModal { ...props } createBaseline={ createBaseline }/>
        );

        wrapper.setState({ baselineName: 'baseline' });
        wrapper.find('input').at(3).simulate('keypress', { key: 'Enter' });
        expect(createBaseline).toHaveBeenCalledTimes(1);
    });
});

describe('ConnectedCreateBaselineModal', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            compareState: {
                historicalProfiles: []
            },
            createBaselineModalState: {
                createBaselineModalOpened: true,
                baselineData: [],
                createBaselineError: {}
            },
            entities: {},
            baselinesTableState: {
                radioTable: {
                    selectedBaselineIds: [],
                    loading: false,
                    emptyState: {},
                    baselineTableData: []
                }
            },
            historicProfilesState: {
                selectedHSPIds: []
            },
            toggleCreateBaselineModal: jest.fn(),
            createBaseline: jest.fn(),
            clearSelectedBaselines: jest.fn()
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedCreateBaselineModal />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should dispatch actions', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedCreateBaselineModal />
                </Provider>
            </MemoryRouter>
        );

        const actions = store.getActions();
        wrapper.find('.pf-c-button').at(2).simulate('click');
        expect(actions).toEqual([
            { type: 'CLEAR_SELECTED_BASELINES_RADIO' },
            { type: 'TOGGLE_CREATE_BASELINE_MODAL' }
        ]);
    });
});
