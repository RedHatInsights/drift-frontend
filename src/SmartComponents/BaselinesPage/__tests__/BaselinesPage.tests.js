import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedBaselinesPage, { BaselinesPage } from '../BaselinesPage';

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

describe('BaselinesPage', () => {
    it('should render correctly', () =>{
        const props = {
            baselinesListLoading: false,
            fullBaselineListData: [],
            emptyState: false
        };

        const wrapper = shallow(
            <BaselinesPage { ...props }/>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ConnectedBaselinesPage', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();

        initialState = {
            baselinesTableState: {
                checkboxTable: {
                    baselineListLoading: false,
                    fullBaselineListData: [],
                    emptyState: false,
                    baselineTableData: [],
                    selectedBaselineIds: []
                },
                radioTable: {
                    baselineListLoading: false,
                    emptyState: false,
                    selectedBaselineIds: []
                }
            },
            createBaselineModalState: {
                createBaselineModalOpened: false,
                error: {}
            },
            addSystemModalState: {
                addSystemModalOpened: false
            }
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedBaselinesPage />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render empty state', () => {
        initialState.baselinesTableState.emptyState = true;
        const store = mockStore(initialState);
        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedBaselinesPage />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
