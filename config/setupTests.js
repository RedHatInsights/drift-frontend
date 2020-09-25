import { configure, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
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
