import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedSystemsTable from '../SystemsTable';
import { createMiddlewareListener } from '../../../store';
import fixtures from './fixtures';

const middlewareListener = createMiddlewareListener();
middlewareListener.getMiddleware();

describe('ConnectedSystemsTable', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        initialState = {
            selectedSystemIds: [],
            createBaselineModal: false,
            hasHistoricalDropdown: false,
            historicalProfiles: [],
            hasMultiSelect: true,
            entities: {
                columns: fixtures.columns,
                rows: fixtures.rows,
                total: 3,
                count: 3,
                selectedSystemIds: []
            },
            setSelectedsystemIds: jest.fn(),
            driftClearFilters: jest.fn(),
            selectHistoricProfiles: jest.fn(),
            updateColumns: jest.fn(),
            selectEntities: jest.fn()
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedSystemsTable />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
