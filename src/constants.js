import { version } from './../package.json';
export const DRIFT_API_ROOT = '/api/drift/v1';
export const BASELINE_API_ROOT = '/api/system-baseline/v1';
export const HISTORICAL_PROFILES_API_ROOT = '/api/historical-system-profiles/v1';
export const ASC = 'asc';
export const DESC = 'desc';
export const FACT_ID = 0;
export const FACT_NAME = 1;
export const FACT_VALUE = 2;

export const API_HEADERS = {
    'X-Insights-Drift': version,
    'Content-Type': 'application/json',
    Accept: 'application/json'
};
