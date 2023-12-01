import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import RemoveSystemCell from './RemoveSystemCell';
import DriftTooltip from '../../../DriftTooltip/DriftTooltip';
import HistoricalProfilesPopover from '../../../HistoricalProfilesPopover/HistoricalProfilesPopover';
import { BlueprintIcon, ClockIcon, ExclamationTriangleIcon, ServerIcon } from '@patternfly/react-icons';
import ReferenceSelector from '../ReferenceSelector/ReferenceSelector';
import helpers from '../../../helpers';

const SystemHeaderCellContent = ({
    fetchCompare,
    item,
    permissions,
    referenceId,
    removeSystemFunc,
    selectHistoricProfiles,
    systemIds,
    updateReferenceId
}) => {
    const itemDetails = useMemo(
        () => {
            if (item.type === 'system') {
                return {
                    type: 'System',
                    icon: <ServerIcon />
                };
            } else if (item.type === 'baseline') {
                return {
                    type: 'Baseline',
                    icon: <BlueprintIcon />
                };
            } else if (item.type === 'historical-system-profile') {
                return {
                    type: 'Historical System',
                    icon: <ClockIcon />
                };
            }
        },
        [ item.type ]
    );
    const selectedBaselineIds = useSelector(({ baselinesTableState }) => baselinesTableState.comparisonTable.selectedBaselineIds);

    return (
        <React.Fragment>
            <RemoveSystemCell
                removeSystemFunc={ removeSystemFunc }
                item={ item }
            />
            <div className='comparison-header'>
                <div>
                    <DriftTooltip
                        content={ itemDetails.type }
                        body={ itemDetails.icon }
                    />
                    <span className="system-name">{ item.display_name }</span>
                </div>
                <div className="system-updated-and-reference">
                    <ReferenceSelector
                        updateReferenceId={ updateReferenceId }
                        item={ item }
                        isReference= { item.id === referenceId }
                    />
                    { item.system_profile_exists === false ?
                        <DriftTooltip
                            position='top'
                            content={ <div>System profile does not exist. Please run insights-client on system to upload archive.</div> }
                            body={ <ExclamationTriangleIcon color="#f0ab00"/> }
                        /> : ''
                    }
                    <span className='margin-right-4-px'>
                        { item.last_updated
                            ? helpers.formatDate(item.last_updated)
                            : helpers.formatDate(item.updated)
                        }
                    </span>
                    { permissions.hspRead &&
                        (item.type === 'system' || item.type === 'historical-system-profile')
                        ? <HistoricalProfilesPopover
                            system={ item }
                            systemIds={ systemIds }
                            systemName={ item.display_name }
                            referenceId={ referenceId }
                            fetchCompare={ fetchCompare }
                            hasCompareButton={ true }
                            hasMultiSelect={ true }
                            selectHistoricProfiles={ selectHistoricProfiles }
                            selectedBaselineIds={ selectedBaselineIds }
                        />
                        : null
                    }
                </div>
            </div>
        </React.Fragment>
    );
};

SystemHeaderCellContent.propTypes = {
    fetchCompare: PropTypes.func,
    item: PropTypes.object,
    permissions: PropTypes.object,
    referenceId: PropTypes.string,
    removeSystemFunc: PropTypes.func,
    selectHistoricProfiles: PropTypes.func,
    systemIds: PropTypes.array,
    updateReferenceId: PropTypes.func
};

export default SystemHeaderCellContent;
