import React from 'react';
import PropTypes from 'prop-types';
import { LongArrowAltUpIcon, LongArrowAltDownIcon, ArrowsAltVIcon } from '@patternfly/react-icons';

import { ASC, DESC } from '../../../../constants';

const SortIcon = ({
    classname,
    sort,
    type
}) => {
    const renderSortButton = (sort) => {
        let sortIcon;

        if (sort === ASC) {
            sortIcon = <LongArrowAltUpIcon className="active-blue" />;
        }
        else if (sort === DESC) {
            sortIcon = <LongArrowAltDownIcon className="active-blue" />;
        }
        else {
            sortIcon = <ArrowsAltVIcon className="not-active" />;
        }

        return sortIcon;
    };

    const icon = renderSortButton(sort);

    return (
        <div className={ classname }>
            { type } { icon }
        </div>
    );
};

SortIcon.propTypes = {
    classname: PropTypes.string,
    sort: PropTypes.string,
    type: PropTypes.string
};

export default SortIcon;
