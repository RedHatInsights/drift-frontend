import React from 'react';
import PropTypes from 'prop-types';
import ComparisonHeaderCell from './ComparisonHeaderCell';
import SystemHeaderCellContent from './SystemHeaderCellContent';

const SystemHeaderCells = ({
    columnWidth,
    fetchCompare,
    masterList,
    permissions,
    referenceId,
    removeSystemFunc,
    selectHistoricProfiles,
    systemIds,
    updateReferenceId
}) => {
    return (
        masterList.map((item) =>
            <ComparisonHeaderCell
                columnWidth={ columnWidth }
                classname={ item.id === referenceId
                    ? 'drift-header right-border reference-header sticky-header'
                    : `drift-header right-border ${item.type}-header sticky-header` }
                key={ item.id }
                id={ item.id }
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
    masterList: PropTypes.array,
    permissions: PropTypes.object,
    referenceId: PropTypes.string,
    removeSystemFunc: PropTypes.func,
    selectHistoricProfiles: PropTypes.func,
    systemIds: PropTypes.array,
    updateReferenceId: PropTypes.func
};

export default SystemHeaderCells;
