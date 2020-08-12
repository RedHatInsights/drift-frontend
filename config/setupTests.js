import { configure, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;

global.insights = {
    chrome: {
        auth: {
            getUser: () => new Promise((resolve) => {
                setTimeout(resolve, 1);
            }),
            logout: jest.fn()
        },
        isBeta: jest.fn()
    }
};
