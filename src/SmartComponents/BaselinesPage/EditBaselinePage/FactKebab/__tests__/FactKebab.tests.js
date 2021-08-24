import React from 'react';

import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedFactKebab, { FactKebab } from '../FactKebab';

describe('FactKebab', () => {
    let props;

    /*eslint-disable camelcase*/
    beforeEach(() => {
        props = {
            factName: 'fact-name',
            factValue: 'Bob',
            fact: { name: 'fact-name', value: 'Bob' },
            isCategory: false,
            isSubFact: false,
            baselineData: {
                id: '1234',
                display_name: 'baseline1',
                baseline_facts: [
                    { name: 'fact-name', value: 'Bob' }
                ],
                created: '2021-06-10T15:29:01.039321Z',
                fact_count: 1,
                updated: '2021-06-10T15:29:16.310292Z'
            },
            deleteBaselineData: jest.fn(),
            fetchBaselineData: jest.fn(),
            toggleFactModal: jest.fn(),
            setFactData: jest.fn()
        };
    });
    /*eslint-enable camelcase*/

    it('should render correctly', () => {
        const wrapper = shallow(
            <FactKebab { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ConnectedFactKebab', () => {
    let initialState;
    let mockStore;
    let props;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            editBaselineState: {
                baselineData: {}
            }
        };
        props = {
            factName: 'fact-name',
            factValue: 'Bob',
            fact: {},
            isCategory: false,
            isSubFact: false,
            baselineData: {},
            deleteBaselineData: jest.fn(),
            fetchBaselineData: jest.fn(),
            toggleFactModal: jest.fn(),
            setFactData: jest.fn()
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedFactKebab { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
