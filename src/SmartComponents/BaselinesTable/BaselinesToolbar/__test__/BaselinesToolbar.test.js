import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';

import ConnectedBaselinesToolbar, { BaselinesToolbar } from '../BaselinesToolbar';
import baselinesTableFixtures from '../../redux/__tests__/baselinesTableReducer.fixtures';

describe('react-dom tests', () => {
    let container = null;
    let props;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        props = {
            tableData: []
        };
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it('renders without a create button', () => {
        act(() => {
            render(<BaselinesToolbar { ...props } />, container);
        });
        expect(container.querySelector('#create-baseline-button')).toBe(null);
    });

    it('renders with a search box', () => {
        act(() => {
            render(<BaselinesToolbar { ...props } />, container);
        });
        expect(container.querySelector('#default-input').placeholder).toBe('Filter by name');
    });
});

describe('jest-tests', () => {
    describe('BaselinesToolbar', () => {
        let props;

        beforeEach(() => {
            props = {
                createButton: true,
                exportButton: true,
                kebab: true,
                tableData: baselinesTableFixtures.baselineTableDataRows,
                tableId: 'CHECKBOX',
                hasMultiSelect: true,
                onSearch: jest.fn()
            };
        });

        it('should render correctly', () => {
            const wrapper = shallow(
                <BaselinesToolbar { ...props } />
            );

            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should call onSearch with clear filters', () => {
            const wrapper = shallow(
                <BaselinesToolbar
                    { ...props }
                />
            );

            wrapper.instance().clearFilters();
            expect(props.onSearch).toHaveBeenCalled();
        });

        it('should toggle modal', () => {
            const wrapper = shallow(
                <BaselinesToolbar
                    { ...props }
                />
            );

            wrapper.setState({ deleteModalOpened: false });
            wrapper.instance().toggleModal();
            expect(wrapper.state().deleteModalOpened).toBe(true);
        });

        it('should clear text filter', () => {
            const wrapper = shallow(
                <BaselinesToolbar
                    { ...props }
                />
            );

            wrapper.setState({ nameSearch: 'something' });
            wrapper.instance().clearTextFilter();
            expect(wrapper.state().nameSearch).toBe('');
        });
    });

    describe('ConnectedBaselinesToolbar', () => {
        let initialState;
        let mockStore;
        let props;
        let wrapper;

        beforeEach(() => {
            mockStore = configureStore();
            initialState = {
                addSystemModalState: {
                    addSystemModalOpened: false
                },
                baselinesTableState: {
                    checkboxTable: {
                        baselineTableData: baselinesTableFixtures.baselineTableDataRows,
                        selectedBaselineIds: []
                    }
                }
            };
            props = {
                createButton: true,
                exportButton: true,
                kebab: true,
                tableData: baselinesTableFixtures.baselineTableDataRows,
                tableId: 'CHECKBOX',
                hasMultiSelect: true
            };
        });

        it('should render correctly', () => {
            const store = mockStore(initialState);
            wrapper = mount(
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedBaselinesToolbar { ...props } />
                    </Provider>
                </MemoryRouter>
            );

            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should call onBulkSelect with true', () => {
            const store = mockStore(initialState);
            const onBulkSelect = jest.fn();
            wrapper = mount(
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedBaselinesToolbar
                            { ...props }
                            onBulkSelect={ onBulkSelect }
                        />
                    </Provider>
                </MemoryRouter>
            );

            wrapper.find('.pf-c-dropdown__toggle-button').simulate('click');
            wrapper.find('.pf-c-dropdown__menu-item').at(0).simulate('click');
            expect(onBulkSelect).toHaveBeenCalledWith(true);
        });

        it('should call onBulkSelect with false', () => {
            const store = mockStore(initialState);
            const onBulkSelect = jest.fn();
            wrapper = mount(
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedBaselinesToolbar
                            { ...props }
                            onBulkSelect={ onBulkSelect }
                        />
                    </Provider>
                </MemoryRouter>
            );

            wrapper.find('.pf-c-dropdown__toggle-button').simulate('click');
            wrapper.find('.pf-c-dropdown__menu-item').at(1).simulate('click');
            expect(onBulkSelect).toHaveBeenCalledWith(false);
        });

        it('should set checked false in BulkSelect', () => {
            const store = mockStore(initialState);
            const wrapper = mount(
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedBaselinesToolbar
                            { ...props }
                        />
                    </Provider>
                </MemoryRouter>
            );

            expect(wrapper.find('BulkSelect').prop('checked')).toBe(false);
        });

        it('should set checked null in BulkSelect', () => {
            props.tableData[1].selected = true;

            const store = mockStore(initialState);
            const wrapper = mount(
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedBaselinesToolbar
                            { ...props }
                        />
                    </Provider>
                </MemoryRouter>
            );

            expect(wrapper.find('BulkSelect').prop('checked')).toBe(null);
        });

        it('should set checked true in BulkSelect', () => {
            props.tableData.forEach(function(baseline) {
                baseline.selected = true;
            });

            const store = mockStore(initialState);
            const wrapper = mount(
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedBaselinesToolbar
                            { ...props }
                        />
                    </Provider>
                </MemoryRouter>
            );

            expect(wrapper.find('BulkSelect').prop('checked')).toBe(true);
        });

        it('should call setTextFilter', () => {
            const store = mockStore(initialState);
            wrapper = mount(
                <MemoryRouter keyLength={ 0 }>
                    <Provider store={ store }>
                        <ConnectedBaselinesToolbar
                            { ...props }
                        />
                    </Provider>
                </MemoryRouter>
            );

            wrapper.setState({ nameSearch: 'something' });
            wrapper.find('input').at(1).simulate('change', 'something-else');
            expect(wrapper.state('nameSearch')).toBe('something');
        });
    });
});
