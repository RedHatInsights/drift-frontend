import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedSystemsTable from '../SystemsTable';
import { createMiddlewareListener } from '../../../store';
import fixtures from './fixtures';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';

const middlewareListener = createMiddlewareListener();
middlewareListener.getMiddleware();

const MockComponent = jest.fn(({ children, loaded }) => {
    return children && loaded ? children : 'Loading...';
});

describe('ConnectedSystemsTable', () => {
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
                inventoryRead: true
            }
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
                    <ConnectedSystemsTable { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with no inventory read permissions', () => {
        const store = mockStore(initialState);
        props.permissions.inventoryRead = false;

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedSystemsTable { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it.skip('should render radio correctly', () => {
        initialState.selectVariant = 'radio';
        const store = mockStore(initialState);

        const wrapper = mount(
            <MemoryRouter keyLength={ 0 }>
                <Provider store={ store }>
                    <ConnectedSystemsTable { ...props } />
                </Provider>
            </MemoryRouter>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should display only RHEL hosts', () => {
        const store = mockStore(initialState);

        mount(<MemoryRouter>
            <Provider store={ store }>
                <ConnectedSystemsTable { ...props } />
            </Provider>
        </MemoryRouter>);

        expect(InventoryTable).toBeCalledWith(expect.objectContaining({ customFilters: {
            filter: {
                // eslint-disable-next-line camelcase
                system_profile: expect.objectContaining({ operating_system: { RHEL: { version: { gte: '0' }}}})
            }
        }}), expect.anything());
    });

    it('should not show CentOS versions in the OS filter', () => {
        const store = mockStore(initialState);

        mount(<MemoryRouter>
            <Provider store={ store }>
                <ConnectedSystemsTable { ...props } />
            </Provider>
        </MemoryRouter>);

        expect(InventoryTable).toBeCalledWith(expect.not.objectContaining({ showCentosVersions: true }), expect.anything());
    });
});
