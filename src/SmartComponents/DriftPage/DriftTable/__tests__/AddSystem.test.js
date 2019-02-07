import React from 'react';
import { render } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AddSystem } from '../AddSystem';
import { toggleAddSystemModal } from '../../../modules/actions';

describe('add system button', () => {
    it('should render correctly', async () => {
        const button = render(
            <AddSystem
                getAddSystemModal={ toggleAddSystemModal }
            />);
        expect(toJson(button)).toMatchSnapshot();
    });
});
