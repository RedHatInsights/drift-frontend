/*global module*/

const SECTION = 'insights';
const APP_ID = 'drift';
const FRONTEND_PORT = 8002;
const routes = {};

// backend
routes[`/api/inventory`] = { host: `http://localhost:8082` };
routes[`/api/system-baseline`] = { host: `http://localhost:8003` };
routes[`/api/drift`] = { host: `http://localhost:8001` };
routes[`/api/historical-system-profiles`] = { host: `http://localhost:8004` };

// frontend
routes[`/preview/${SECTION}/${APP_ID}`] = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/${SECTION}/${APP_ID}`]      = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/preview/apps/${APP_ID}`]       = { host: `http://localhost:${FRONTEND_PORT}` };
routes[`/apps/${APP_ID}`]            = { host: `http://localhost:${FRONTEND_PORT}` };

module.exports = { routes };
