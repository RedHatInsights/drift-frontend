import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';
import { Button } from '@patternfly/react-core';

import ConnectedNotificationsSystemsTable from '../NotificationsSystemsTable';
import { createMiddlewareListener } from '../../../store';
import fixtures from './fixtures';

const middlewareListener = createMiddlewareListener();
middlewareListener.getMiddleware();

const MockComponent = jest.fn(({ children, loaded }) => {
    return children && loaded ? children : 'Loading...';
});

describe('ConnectedNotificationsSystemsTable', () => {
    let initialState;
    let mockStore;
    let props;

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
            selectVariant: 'checkbox',
            setSelectedSystemIds: jest.fn(),
            driftClearFilters: jest.fn(),
            selectHistoricProfiles: jest.fn(),
            updateColumns: jest.fn(),
            selectEntities: jest.fn()
        };
        props = {
            permissions: {
                inventoryRead: true,
                notificationsWrite: true
            },
            toolbarButton: <Button
                key="add-baseline-notification"
                variant="primary"
                onClick={ jest.fn() }
                ouiaId="add-baseline-notification-button"
                isDisabled={ false }
            >
                Add system
            </Button>
        };

        global.window.insights = {
            loadInventory: jest.fn(() => {
                return Promise.resolve({
                    inventoryConnector: () => ({
                        InventoryDetails: MockComponent
                    }),
                    INVENTORY_ACTION_TYPES: {},
                    mergeWithEntities: () => ({})
                });
            })
        };
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedNotificationsSystemsTable { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with no inventoryWrite permissions', () => {
        const store = mockStore(initialState);
        props.permissions.notificationsWrite = false;

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedNotificationsSystemsTable { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
