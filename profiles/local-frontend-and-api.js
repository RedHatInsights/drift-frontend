/*global module*/

const SECTION = 'insights';
const DRIFT_APP_ID = 'drift';
const BASELINE_APP_ID = 'system-baseline';
const FRONTEND_PORT = 8002;
const DRIFT_PORT = 8080;
const BASELINE_PORT = 8085;
const routes = {};

routes[`/beta/${SECTION}/${DRIFT_APP_ID}`] = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/${SECTION}/${DRIFT_APP_ID}`]      = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/beta/apps/${DRIFT_APP_ID}`]       = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/apps/${DRIFT_APP_ID}`]            = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/api/${BASELINE_APP_ID}`]       = { host: `http://localhost:${BASELINE_PORT}` };

routes[`/api/${DRIFT_APP_ID}`] = { host: `http://localhost:${DRIFT_PORT}` };

module.exports = { routes };
