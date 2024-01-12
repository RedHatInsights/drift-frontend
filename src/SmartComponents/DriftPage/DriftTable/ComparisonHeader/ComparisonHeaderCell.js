import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const ComparisonHeaderCell = ({
    columnWidth,
    classname,
    key,
    id,
    clickFunc,
    setColumnHeaderWidth,
    ouiaType,
    ouiaId,
    children
}) => {
    useEffect(() => {
        if (columnWidth?.current !== null && setColumnHeaderWidth) {
            setColumnHeaderWidth(columnWidth?.current.offsetWidth);
        }
    }, [ columnWidth?.current ]);

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
    setColumnHeaderWidth: PropTypes.func,
    ouiaType: PropTypes.string,
    ouiaId: PropTypes.string,
    children: PropTypes.node
};

export default ComparisonHeaderCell;
