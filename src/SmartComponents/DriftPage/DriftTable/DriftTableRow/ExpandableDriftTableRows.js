import React from 'react';
import PropTypes from 'prop-types';
import DriftTableRow from './DriftTableRow';

const ExpandableDriftTableRows = ({
    columnWidth,
    comparison,
    expandedRows,
    mainList,
    referenceId,
    stateSort
}) => {
    return (
        <>
            <DriftTableRow
                expandedRows={ expandedRows }
                fact={ comparison }
                mainList={ mainList }
                referenceId={ referenceId }
                stateSort={ stateSort }
                type={ comparison.multivalues ? 'multi fact' : 'sub fact' }
                columnWidth={ columnWidth }
            />
            { expandedRows.includes(comparison.name) &&
                comparison.multivalues.map((subFactItem) =>
                    <DriftTableRow
                        key={ subFactItem.name }
                        expandedRows={ expandedRows }
                        fact={ subFactItem }
                        mainList={ mainList }
                        referenceId={ referenceId }
                        stateSort={ stateSort }
                        type={ 'multi value' }
                        columnWidth={ columnWidth }
                    />
                )
            }
        </>
    );
};

ExpandableDriftTableRows.propTypes = {
    columnWidth: PropTypes.string,
    comparison: PropTypes.array,
    expandedRows: PropTypes.array,
    mainList: PropTypes.array,
    referenceId: PropTypes.string,
    stateSort: PropTypes.string
};

export default ExpandableDriftTableRows;
