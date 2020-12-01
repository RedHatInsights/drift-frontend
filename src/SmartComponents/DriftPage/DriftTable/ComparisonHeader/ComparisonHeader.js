import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@patternfly/react-core';
import { ClockIcon, TimesIcon, ExclamationTriangleIcon, ServerIcon, BlueprintIcon } from '@patternfly/react-icons';
import { LongArrowAltUpIcon, LongArrowAltDownIcon, ArrowsAltVIcon } from '@patternfly/react-icons';
import moment from 'moment';

import { ASC, DESC } from '../../../../constants';

import HistoricalProfilesPopover from '../../../HistoricalProfilesPopover/HistoricalProfilesPopover';
import ReferenceSelector from '../ReferenceSelector/ReferenceSelector';

class ComparisonHeader extends Component {
    constructor(props) {
        super(props);
    }

    formatDate = (dateString) => {
        return moment.utc(dateString).format('DD MMM YYYY, HH:mm UTC');
    }

    renderSortButton(sort) {
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
    }

    toggleSort(sortType, sort) {
        const { toggleFactSort, toggleStateSort } = this.props;

        if (sortType === 'fact') {
            toggleFactSort(sort);
        } else {
            toggleStateSort(sort);
        }
    }

    renderSystemHeaders() {
        const { fetchCompare, masterList, referenceId, removeSystem, systemIds, updateReferenceId } = this.props;

        let row = [];
        let typeIcon = '';

        masterList.forEach(item => {
            if (item.type === 'system') {
                typeIcon = <Tooltip
                    position='top'
                    content={ <div>System</div> }
                >
                    <ServerIcon/>
                </Tooltip>;
            } else if (item.type === 'baseline') {
                typeIcon = <Tooltip
                    position='top'
                    content={ <div>Baseline</div> }
                >
                    <BlueprintIcon/>
                </Tooltip>;
            } else if (item.type === 'historical-system-profile') {
                typeIcon = <Tooltip
                    position='top'
                    content={ <div>Historical system</div> }
                >
                    <ClockIcon />
                </Tooltip>;
            }

            row.push(
                <th
                    header-id={ item.id }
                    key={ item.id }
                    className={
                        item.id === referenceId
                            ? 'drift-header reference-header'
                            : `drift-header ${item.type}-header`
                    }
                >
                    <div>
                        <a onClick={ () => removeSystem(item) } className="remove-system-icon">
                            <TimesIcon/>
                        </a>
                    </div>
                    <div className='comparison-header'>
                        <div className="drift-header-icon">
                            { typeIcon }
                        </div>
                        <div className="system-name">{ item.display_name }</div>
                        <div className="system-updated-and-reference">
                            <ReferenceSelector
                                updateReferenceId={ updateReferenceId }
                                item={ item }
                                isReference= { item.id === referenceId }
                            />
                            { item.system_profile_exists === false ?
                                <Tooltip
                                    position='top'
                                    content={
                                        <div>System profile does not exist. Please run insights-client on system to upload archive.</div>
                                    }
                                >
                                    <ExclamationTriangleIcon color="#f0ab00"/>
                                </Tooltip> : ''
                            }
                            { item.last_updated
                                ? this.formatDate(item.last_updated)
                                : this.formatDate(item.updated)
                            }
                            { item.type === 'system' || item.type === 'historical-system-profile'
                                ? <HistoricalProfilesPopover
                                    system={ item }
                                    systemIds={ systemIds }
                                    referenceId={ referenceId }
                                    fetchCompare={ fetchCompare }
                                    hasCompareButton={ true }
                                    hasMultiSelect={ true }
                                />
                                : null
                            }
                        </div>
                    </div>
                </th>
            );
        });

        return row;
    }

    renderHeaderRow() {
        const { factSort, stateSort } = this.props;

        return (
            <tr className="sticky-column-header">
                <th
                    className="fact-header sticky-column fixed-column-1 pointer"
                    key='fact-header'
                    id={ factSort }
                    onClick={ () => this.toggleSort('fact', factSort) }
                >
                    <div className="active-blue">Fact { this.renderSortButton(factSort) }</div>
                </th>
                <th
                    className="state-header sticky-column fixed-column-2 pointer"
                    key='state-header'
                    id={ stateSort || 'disabled' }
                    onClick={ () => this.toggleSort('state', stateSort) }
                >
                    { stateSort !== ''
                        ? <div className="active-blue">State { this.renderSortButton(stateSort) }</div>
                        : <div>State { this.renderSortButton(stateSort) }</div>
                    }
                </th>
                { this.renderSystemHeaders() }
            </tr>
        );
    }

    render() {
        return (
            <React.Fragment>
                { this.renderHeaderRow() }
            </React.Fragment>
        );
    }
}

ComparisonHeader.propTypes = {
    factSort: PropTypes.string,
    fetchCompare: PropTypes.func,
    masterList: PropTypes.array,
    referenceId: PropTypes.string,
    removeSystem: PropTypes.func,
    stateSort: PropTypes.string,
    systemIds: PropTypes.array,
    toggleFactSort: PropTypes.func,
    toggleStateSort: PropTypes.func,
    updateReferenceId: PropTypes.func
};

export default ComparisonHeader;
