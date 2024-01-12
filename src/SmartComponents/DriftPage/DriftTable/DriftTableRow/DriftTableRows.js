import React from 'react';
import PropTypes from 'prop-types';
import DriftTableRow from './DriftTableRow';
import ExpandableDriftTableRows from './ExpandableDriftTableRows';

const DriftTableRows = ({
    columnWidth,
    expandedRows,
    filteredCompareData,
    mainList,
    referenceId,
    stateSort
}) => {
    return (
        filteredCompareData &&
        filteredCompareData.map((fact) => {
            return (
                <>
                    <DriftTableRow
                        expandedRows={ expandedRows }
                        fact={ fact }
                        mainList={ mainList }
                        referenceId={ referenceId }
                        stateSort={ stateSort }
                        type={ fact.comparisons ? 'category' : 'fact' }
                        columnWidth={ columnWidth }
                    />
                    { expandedRows.includes(fact.name) &&
                        fact.comparisons.map((comparison) =>
                            <ExpandableDriftTableRows
                                key={ comparison.name }
                                columnWidth={ columnWidth }
                                comparison={ comparison }
                                expandedRows={ expandedRows }
                                mainList={ mainList }
                                referenceId={ referenceId }
                                stateSort={ stateSort }
                            />
                        )
                    }
                </>
            );
        })
    );
};

DriftTableRows.propTypes = {
    columnWidth: PropTypes.string,
    expandedRows: PropTypes.array,
    filteredCompareData: PropTypes.array,
    mainList: PropTypes.array,
    referenceId: PropTypes.string,
    stateSort: PropTypes.string
};

export default DriftTableRows;
