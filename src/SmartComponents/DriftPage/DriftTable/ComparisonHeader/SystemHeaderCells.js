import React from 'react';
import PropTypes from 'prop-types';
import ComparisonHeaderCell from './ComparisonHeaderCell';
import SystemHeaderCellContent from './SystemHeaderCellContent';

const SystemHeaderCells = ({
    columnWidth,
    fetchCompare,
    mainList,
    permissions,
    referenceId,
    removeSystemFunc,
    selectHistoricProfiles,
    setColumnHeaderWidth,
    systemIds,
    updateReferenceId
}) => {
    return (
        mainList.map((item) =>
            <ComparisonHeaderCell
                columnWidth={ columnWidth }
                classname={ item.id === referenceId
                    ? 'drift-header right-border reference-header sticky-header'
                    : `drift-header right-border ${item.type}-header sticky-header` }
                key={ item.id }
                id={ item.id }
                setColumnHeaderWidth={ setColumnHeaderWidth }
            >
                <SystemHeaderCellContent
                    fetchCompare={ fetchCompare }
                    item={ item }
                    permissions={ permissions }
                    referenceId={ referenceId }
                    removeSystemFunc={ removeSystemFunc }
                    selectHistoricProfiles={ selectHistoricProfiles }
                    systemIds={ systemIds }
                    updateReferenceId={ updateReferenceId }
                />
            </ComparisonHeaderCell>
        )
    );
};

SystemHeaderCells.propTypes = {
    columnWidth: PropTypes.string,
    fetchCompare: PropTypes.func,
    mainList: PropTypes.array,
    permissions: PropTypes.object,
    referenceId: PropTypes.string,
    removeSystemFunc: PropTypes.func,
    selectHistoricProfiles: PropTypes.func,
    setColumnHeaderWidth: PropTypes.func,
    systemIds: PropTypes.array,
    updateReferenceId: PropTypes.func
};

export default SystemHeaderCells;
