import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { PlaystationIcon } from '@patternfly/react-icons';

import DriftTooltip from '../DriftTooltip';

describe('DriftTooltip', () => {
    let props;

    beforeEach(() => {
        props = {
            content: 'This is a tooltip.',
            body: <PlaystationIcon />
        };
    });

    it('should render correctly', () => {
        const wrapper = shallow(
            <DriftTooltip { ...props } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
