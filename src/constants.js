import version from './../package.json';
import { dispatchNotification } from './Utilities/Dispatcher';

export const DRIFT_API_ROOT = '/api/drift/v1';
export const BASELINE_API_ROOT = '/api/system-baseline/v1';
export const HISTORICAL_PROFILES_API_ROOT = '/api/historical-system-profiles/v1';
export const ASC = 'asc';
export const DESC = 'desc';
export const FACT_ID = 0;
export const FACT_NAME = 1;
export const FACT_VALUE = 2;
export const COLUMN_DELIMITER = ',';
export const LINE_DELIMITER = '\n';

export const API_HEADERS = {
    'X-Insights-Drift': version,
    'Content-Type': 'application/json',
    Accept: 'application/json'
};

/*
    String constants for empty states
*/

export const EMPTY_COMPARISON_TITLE = 'No systems or baselines to compare';
export const EMPTY_COMPARISON_MESSAGE = [
    'To get started, add at least two systems or baselines to compare their facts.'
];
export const EMPTY_BASELINES_FILTER_TITLE = 'No matching baselines found';
export const EMPTY_FILTER_MESSAGE = [
    'To continue, edit your filter settings and search again.'
];
export const EMPTY_BASELINES_TITLE = 'No baselines';
export const EMPTY_BASELINES_MESSAGE = [
    'You currently have no baselines displayed.',
    'Create a baseline to use in your Comparison analysis.'
];
export const EMPTY_BASELINE_TITLE = 'No facts or categories yet';
export const EMPTY_BASELINE_MESSAGE = [
    'To get started, add a fact or category to this baseline.'
];
export const EMPTY_RADIO_MESSAGE = [
    'You currently have no baselines displayed.',
    'Create a baseline first in order to copy from it. '
];

export const bulkSelectItems = (onBulkSelect, page) => ([
    {
        title: `Select page (${ page })`,
        key: 'select-page',
        ouiaId: 'baselines-select-page',
        onClick: () => onBulkSelect('page')
    },
    {
        title: 'Select none (0)',
        key: 'select-none',
        ouiaId: 'baselines-select-none',
        onClick: () => onBulkSelect('none')
    }
]);

export const preparingExportNotification = (store) => (
    dispatchNotification({
        variant: 'info',
        title: 'Preparing export',
        description: 'Once complete, your download will start automatically.',
        dismissable: true
    }, store)
);

export const successfulExportNotification = (store) => (
    dispatchNotification({
        variant: 'success',
        title: 'Downloading export',
        dismissable: true
    }, store)
);

export const errorExportNotification = (store) => (
    dispatchNotification({
        variant: 'danger',
        title: 'Could not download export',
        description: 'Reinitiate this export to try again.',
        dismissable: true,
        autoDismiss: false
    }, store)
);
