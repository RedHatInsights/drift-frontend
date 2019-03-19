import { version } from './../package.json';
export const DRIFT_API_ROOT = '/api/drift/v0';

export const API_HEADERS = {
    'X-Insights-Drift': version,
    'Content-Type': 'application/json',
    Accept: 'application/json'
};
