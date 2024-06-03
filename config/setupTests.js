import { configure, mount, render, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
    __esModule: true,
    default: () => ({
        updateDocumentTitle: jest.fn(),
        appAction: jest.fn(),
        appObjectId: jest.fn(),
        on: jest.fn(),
        getUserPermissions: () => Promise.resolve([ 'inventory:*:*' ]),
        isBeta: jest.fn(),
        getApp: () => 'drift',
        getBundle: () => 'insights'
    }),
    useChrome: () => ({
        isBeta: jest.fn(),
        appAction: jest.fn()
    })
}));

jest.mock('@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate', () => ({
    __esModule: true,
    default: () => jest.fn(),
    useInsightsNavigate: () => jest.fn()
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({ hash: '', search: '' }),
    useNavigate: () => jest.fn(),
    useSearchParams: () => [{ get: () => '', getAll: () => '' }, () => jest.fn() ]
}));

jest.mock('@redhat-cloud-services/frontend-components/Inventory', () => ({
    InventoryTable: jest.fn(() => <div className='testInventoryComponentChild'><div>This is child</div></div>)
}));

jest.mock('@redhat-cloud-services/frontend-components/AsyncComponent', () => (
    <div>AsyncComponent</div>
));

configure({ adapter: new Adapter() });
global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
global.window = Object.create(window);
global.window.insights = {
    ...window.insights || {},
    chrome: {
        auth: {
            getUser: () => new Promise((res) => res({
                identity: {
                    // eslint-disable-next-line camelcase
                    account_number: '0',
                    type: 'User'
                },
                entitlements: {
                    insights: {
                        // eslint-disable-next-line camelcase
                        is_entitled: true
                    }
                }
            }))
        },
        isBeta: jest.fn(),
        getUserPermissions: () => new Promise((res) => res([
            {
                permission: 'drift:*:*',
                resourceDefinitions: []
            }
        ]))
    }
};

global.window.__scalprum__ = {
    scalprumOptions: {
        cacheTimeout: 999999
    },
    appsConfig: {
        inventory: {
            manifestLocation: 'https://console.stage.redhat.com/apps/inventory/fed-mods.json?ts=1643875037626',
            module: 'inventory#./RootApp',
            name: 'inventory'
        }
    },
    factories: {
        inventory: {
            expiration: new Date('01-01-3000'),
            modules: {
                './InventoryTable': {
                    __esModule: true,
                    default: () => <div><h1>Inventory mock</h1></div>
                }
            }
        }
    }
};
