import React from 'react';
import PropTypes from 'prop-types';

const ComparisonHeaderCell = ({
    columnWidth,
    classname,
    key,
    id,
    clickFunc,
    ouiaType,
    ouiaId,
    children
}) => {
    return (
        <th
            className={ classname }
            key={ key }
            id={ id }
            onClick={ clickFunc }
            ref={ columnWidth }
            data-ouia-component-type={ ouiaType }
            data-ouia-component-id={ ouiaId }
        >
            {children}
        </th>
    );
};

ComparisonHeaderCell.propTypes = {
    classname: PropTypes.string,
    columnWidth: PropTypes.object,
    key: PropTypes.string,
    id: PropTypes.string,
    clickFunc: PropTypes.func,
    ouiaType: PropTypes.string,
    ouiaId: PropTypes.string,
    children: PropTypes.node
};

export default ComparisonHeaderCell;
