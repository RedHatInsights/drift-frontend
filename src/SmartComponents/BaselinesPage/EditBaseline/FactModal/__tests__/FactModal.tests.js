import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedFactModal, { FactModal } from '../FactModal';

describe('FactModal', () => {
    let props;

    beforeEach(() => {
        props = {
            factModalOpened: true,
            factName: '',
            factValue: '',
            factData: [],
            isCategory: false,
            isSubFact: false,
            baselineData: [],
            inlineError: {},
            toggleFactModal: jest.fn(),
            patchBaseline: jest.fn(),
            fetchBaselineData: jest.fn()
        };
    });

    it('should render empty correctly', () => {
        const wrapper = shallow(
            <FactModal { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render fact name and value correctly', () => {
        props.factName = 'cool';
        props.factValue = 'fact';
        props.factData = { name: 'cool', value: 'fact' };
        const wrapper = shallow(
            <FactModal { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render category correctly', () => {
        props.factName = 'cool';
        props.factValue = undefined;
        props.factData = { name: 'cool', value: []};
        props.isCategory = true;
        const wrapper = shallow(
            <FactModal { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render sub fact correctly', () => {
        props.factName = 'cool';
        props.factValue = 'subfact';
        props.factData = { name: 'parent', value: [{ name: 'cool', value: 'subfact' }]};
        props.isSubFact = true;
        const wrapper = shallow(
            <FactModal { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it.skip('should call clearBaselineData', () => {
            const clearBaselineData = jest.fn();
            const history = { location: { pathname: '/baselines' }, push: jest.fn() };
            const wrapper = shallow(
                <FactModal
                    { ...props }
                    clearBaselineData={ clearBaselineData }
                    history={ history }
                />
            );

            wrapper.find('a').simulate('click');
            expect(clearBaselineData).toHaveBeenCalled();
        });
    });
});

describe('ConnectedFactModal', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            editBaselineState: {
                factModalOpened: true,
                factName: '',
                factValue: '',
                factData: [],
                isCategory: false,
                isSubFact: false,
                baselineData: [],
                inlineError: {
                    hasOwnProperty: jest.fn()
                }
            },
            toggleFactModal: jest.fn(),
            patchBaseline: jest.fn(),
            fetchBaselineData: jest.fn()
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedFactModal />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
