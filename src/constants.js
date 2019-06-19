import { version } from './../package.json';
export const DRIFT_API_ROOT = '/api/drift/v1';
export const BASELINE_API_ROOT = '/api/system_baseline/v0';
export const ASC = 'asc';
export const DESC = 'desc';

export const API_HEADERS = {
    'X-Insights-Drift': version,
    'Content-Type': 'application/json',
    Accept: 'application/json'
};
