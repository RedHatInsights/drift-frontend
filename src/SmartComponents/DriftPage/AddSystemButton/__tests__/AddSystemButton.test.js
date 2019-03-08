import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import AddSystemButton from '../AddSystemButton';
import configureStore from 'redux-mock-store';
import toJson from 'enzyme-to-json';

describe('add system button', () => {
    const mockStore = configureStore();
    let store;

    beforeEach(() =>
        store = mockStore({})
    );

    it('should render correctly', async () => {
        const button = shallow(<Provider store={ store }><AddSystemButton /></Provider>);
        expect(toJson(button)).toMatchSnapshot();
    });
});
