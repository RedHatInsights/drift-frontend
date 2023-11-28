import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@patternfly/react-core';

export const DriftTooltip = ({
    content,
    body,
    position
}) => {
    return (
        <Tooltip
            position={ position }
            content={ content }
        >
            { body }
        </Tooltip>
    );
};

DriftTooltip.propTypes = {
    content: PropTypes.string,
    body: PropTypes.any,
    position: PropTypes.string
};

export default DriftTooltip;
