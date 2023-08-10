import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { createMiddlewareListener, init } from '../../../../store';
import api from '../../../../api';
import { globalFilterInitialState } from '../../../modules/reducers';
import tableDataFixtures from '../../../BaselinesTable/redux/__tests__/baselinesTableReducer.fixtures';
import CreateBaselineModal from '../CreateBaselineModal';

jest.mock('../../../../api');

const middlewareListener = createMiddlewareListener();
middlewareListener.getMiddleware();

describe('CreateBaselineModal', () => {
    let props;
    const store = init().registry.getStore();

    beforeEach(() => {
        props = {
            permissions: {
                hspRead: true,
                baselinesWrite: true,
                baselinesRead: true
            },
            middlewareListener
        };
        store.getState().globalFilterState = globalFilterInitialState;
        store.getState().createBaselineModalState.createBaselineModalOpened = true;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render correctly', async () => {
        render(
            <Provider store={ store }>
                <CreateBaselineModal { ...props }/>
            </Provider>
        );
        const modal = screen.getByLabelText('create-baseline-modal');
        expect(modal).toMatchSnapshot();
    });

    it('should render error correctly', async() => {
        api.postNewBaseline.mockImplementation(async () => {
            return await Promise.reject({
                response: { data: {}, status: 404, detail: 'This is an error' }
            });
        });

        render(
            <Provider store={ store }>
                <CreateBaselineModal { ...props } />
            </Provider>
        );
        const input = screen.getByLabelText('baseline name');
        await waitFor(() => fireEvent.change(input, { target: { value: 'bogus' }}));
        await waitFor(() => userEvent.click(screen.getByLabelText('create-baseline-confirm')));

        expect(input).toBeInvalid();
    });

    it('should use handleChecked', async () => {
        render(
            <Provider store={ store }>
                <CreateBaselineModal { ...props } />
            </Provider>
        );

        const copyBaselineRadio = screen.getByTestId('copy-baseline-radio');
        await waitFor(() => userEvent.click(copyBaselineRadio));
        expect(copyBaselineRadio.checked).toEqual(true);

        const copySystemRadio = screen.getByTestId('copy-system-radio');
        await waitFor(() => userEvent.click(copySystemRadio));
        expect(copyBaselineRadio.checked).toEqual(false);
        expect(copySystemRadio.checked).toEqual(true);

        const fromScratchRadio = screen.getByTestId('from-scratch-radio');
        await waitFor(() => userEvent.click(fromScratchRadio));
        expect(copySystemRadio.checked).toEqual(false);
        expect(fromScratchRadio.checked).toEqual(true);
    });

    it('should update baselineName', async () => {
        render(
            <Provider store={ store }>
                <CreateBaselineModal { ...props }/>
            </Provider>
        );

        const input = screen.getByLabelText('baseline name');
        await waitFor(() => fireEvent.change(input, { target: { value: 'baselines rock' }}));
        expect(input.value).toEqual('baselines rock');
    });

    it('should submit baselineName with copyBaselineChecked', async () => {
        api.getBaselineList.mockImplementation(async () => {
            return tableDataFixtures.baselinesListPayload;
        });
        render(
            <Provider store={ store }>
                <CreateBaselineModal { ...props }/>
            </Provider>
        );

        const copyBaselineRadio = screen.getByTestId('copy-baseline-radio');
        await waitFor(() => userEvent.click(copyBaselineRadio));

        const input = screen.getByLabelText('baseline name');
        await waitFor(() => fireEvent.change(input, { target: { value: 'baselines rock' }}));

        await waitFor(() => userEvent.click(screen.getByLabelText('Select row 0')));

        await waitFor(() => userEvent.click(screen.getByLabelText('create-baseline-confirm')));

        expect(api.getBaselineList).toHaveBeenCalledTimes(1);
    });

    it('should cancelModal', async () => {
        api.getBaselineList.mockImplementation(async () => {
            return tableDataFixtures.baselinesListPayload;
        });

        render(
            <Provider store={ store }>
                <CreateBaselineModal { ...props }/>
            </Provider>
        );

        const copyBaselineRadio = screen.getByTestId('copy-baseline-radio');
        await waitFor(() => userEvent.click(copyBaselineRadio));

        await waitFor(() => userEvent.click(screen.getByLabelText('Select row 0')));
        expect(store.getState().baselinesTableState.radioTable.selectedBaselineIds).toEqual([ '1234' ]);

        const cancelButton = screen.getByLabelText('cancel-create-baseline');
        await waitFor(() => userEvent.click(cancelButton));
        expect(store.getState().baselinesTableState.radioTable.selectedBaselineIds).toEqual([]);
        expect(store.getState().createBaselineModalState.createBaselineModalOpened).toEqual(false);
    });
});
