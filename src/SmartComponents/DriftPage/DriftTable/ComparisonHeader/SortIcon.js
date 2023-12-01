import React from 'react';
import PropTypes from 'prop-types';
import { LongArrowAltUpIcon, LongArrowAltDownIcon, ArrowsAltVIcon } from '@patternfly/react-icons';

import { ASC } from '../../../../constants';

const SortIcon = ({
    classname,
    sort,
    type,
    ...props
}) => {
    const Icon = sort && (sort === ASC ? LongArrowAltUpIcon : LongArrowAltDownIcon) || ArrowsAltVIcon;
    const iconClassname = sort ? 'active-blue' : 'not-active';

    return (
        <div className={ classname }>
            { type } <Icon className={ iconClassname } { ...props } />
        </div>
    );
};

SortIcon.propTypes = {
    classname: PropTypes.string,
    sort: PropTypes.string,
    type: PropTypes.string
};

export default SortIcon;
