import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@patternfly/react-core';

export const DriftTooltip = ({
    content,
    body
}) => {
    return (
        <Tooltip
            content={ content }
        >
            { body }
        </Tooltip>
    );
};

DriftTooltip.propTypes = {
    content: PropTypes.string,
    body: PropTypes.any
};

export default DriftTooltip;
