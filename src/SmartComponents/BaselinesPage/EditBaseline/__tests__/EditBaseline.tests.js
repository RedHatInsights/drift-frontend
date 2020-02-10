import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';
import helpersFixtures from './helpers.fixtures';

import ConnectedEditBaseline, { EditBaseline } from '../EditBaseline';

global.insights = {
    chrome: {
        auth: {
            getUser: () => new Promise((resolve) => {
                setTimeout(resolve, 1);
            }),
            logout: jest.fn()
        }
    }
};

describe('EditBaseline', () => {
    let props;

    beforeEach(() => {
        props = {
            baselineData: [],
            baselineDataLoading: false,
            factModalOpened: false,
            editBaselineTableData: [],
            expandedRows: [],
            selectAll: false,
            match: { params: {}},
            history: { push: jest.fn() },
            fetchBaselineData: jest.fn()
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <EditBaseline { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should call clearBaselineData on Breadcrumb click', () => {
        const clearBaselineData = jest.fn();
        const wrapper = shallow(
            <EditBaseline { ...props } clearBaselineData={ clearBaselineData } />
        );

        wrapper.find('a').simulate('click');
        expect(clearBaselineData).toHaveBeenCalledTimes(1);
    });

    it('should render loading rows', () => {
        props.baselineData = undefined;
        const wrapper = shallow(
            <EditBaseline { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render expandable rows closed', () => {
        props.editBaselineTableData = helpersFixtures.mockBaselineTableData1;
        props.baselineData = helpersFixtures.mockBaselineAPIBody;
        const wrapper = shallow(
            <EditBaseline { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render expandable rows opened', () => {
        props.editBaselineTableData = helpersFixtures.mockBaselineTableData1;
        props.baselineData = helpersFixtures.mockBaselineAPIBody;
        props.expandedRows = [ 'The Fellowship of the Ring' ];
        const wrapper = shallow(
            <EditBaseline { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ConnectedEditBaseline', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            editBaselineState: {
                baselineData: [],
                baselineDataLoading: false,
                factModalOpened: false,
                editBaselineTableData: [],
                expandedRows: [],
                selectAll: false,
                error: {
                    hasOwnProperty: jest.fn()
                }
            },
            match: { params: {}}
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedEditBaseline />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
