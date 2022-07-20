import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { ArrowsAltVIcon, BlueprintIcon, ClockIcon, DisconnectedIcon, ExclamationTriangleIcon,
    LongArrowAltUpIcon, LongArrowAltDownIcon, ServerIcon, TimesIcon } from '@patternfly/react-icons';
import moment from 'moment';
import debounce from 'lodash/debounce';

import { ASC, DESC } from '../../../../constants';

import HistoricalProfilesPopover from '../../../HistoricalProfilesPopover/HistoricalProfilesPopover';
import ReferenceSelector from '../ReferenceSelector/ReferenceSelector';

class ComparisonHeader extends Component {
    constructor(props) {
        super(props);
        this.columnWidth = React.createRef();

        this.state = {
            refState: null
        };
    }

    setColumnWidth = () => {
        if (this.columnWidth) {
            this.props.setColumnHeaderWidth(this.columnWidth.current.offsetWidth);
            this.setState({ refState: this.columnWidth });
        }
    };

    componentDidMount() {
        window.addEventListener('resize', debounce(this.setColumnWidth, 500));
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

    async toggleSort(sortType, sort) {
        const { setHistory, toggleFactSort, toggleStateSort } = this.props;

        if (sortType === 'fact') {
            await toggleFactSort(sort);
        } else {
            await toggleStateSort(sort);
        }

        setHistory();
    }

    renderLoadingSystems() {
        return [ <td key='loading-systems-header'><Skeleton size={ SkeletonSize.md } /></td> ];
    }

    renderInsightsIcons = (item) => {
        return (
            <React.Fragment>
                { item.system_stale
                    ? <Tooltip
                        position='top'
                        content={ <div>Stale system</div> }
                    >
                        <ExclamationTriangleIcon />
                    </Tooltip>
                    : null
                }
                { item.insights_enabled === false || item.insights_installed === false
                    ? <Tooltip
                        position='top'
                        content={ !item.insights_installed
                            ? <div>Insights not installed</div>
                            : <div>Insights not enabled</div> }
                    >
                        <DisconnectedIcon />
                    </Tooltip>
                    : null
                }
            </React.Fragment>
        );
    }

    renderSystemHeaders() {
        const { fetchCompare, masterList, permissions, referenceId, removeSystem, selectedBaselineIds,
            selectedHSPIds, selectHistoricProfiles, systemIds, updateReferenceId } = this.props;

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
                    ref={ this.columnWidth }
                    header-id={ item.id }
                    key={ item.id }
                    className={ item.id === referenceId
                        ? 'drift-header right-border reference-header sticky-header'
                        : `drift-header right-border ${item.type}-header sticky-header` }
                >
                    <div>
                        <a
                            aria-label='remove-system-icon'
                            onClick={ () => removeSystem(item) }
                            className="remove-system-icon"
                            data-ouia-component-type='PF4/Button'
                            data-ouia-component-id={ 'remove-system-button-' + item.id } >
                            <TimesIcon/>
                        </a>
                    </div>
                    <div className='comparison-header'>
                        <div>
                            <span className="drift-header-icon">
                                { typeIcon }
                            </span>
                            <span className="system-name">{ item.display_name }</span>
                        </div>
                        <div className="system-updated-and-reference">
                            <ReferenceSelector
                                updateReferenceId={ updateReferenceId }
                                item={ item }
                                isReference= { item.id === referenceId }
                            />
                            { item.system_profile_exists === false ?
                                <Tooltip
                                    position='top'
                                    content={ <div>System profile does not exist. Please run insights-client on system to upload archive.</div> }
                                >
                                    <ExclamationTriangleIcon color="#f0ab00"/>
                                </Tooltip> : ''
                            }
                            <span className='system-header-date-margin'>
                                { item.last_updated
                                    ? this.formatDate(item.last_updated)
                                    : this.formatDate(item.updated)
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
                                    selectedHSPIds={ selectedHSPIds }
                                    selectHistoricProfiles={ selectHistoricProfiles }
                                    selectedBaselineIds={ selectedBaselineIds }
                                />
                                : null
                            }
                            { this.renderInsightsIcons(item) }
                        </div>
                    </div>
                </th>
            );
        });

        if (this.state.refState === null && this.columnWidth?.current !== null) {
            this.setColumnWidth();
        }

        return row;
    }

    renderHeaderRow() {
        const { factSort, masterList, stateSort } = this.props;

        return (
            <tr className="sticky-column-header" data-ouia-component-type='PF4/TableRow' data-ouia-component-id='comparison-table-header-row'>
                <th
                    className="fact-header sticky-column fixed-column-1 pointer sticky-header"
                    key='fact-header'
                    id={ factSort }
                    onClick={ () => this.toggleSort('fact', factSort) }
                    data-ouia-component-type="PF4/Button"
                    data-ouia-component-id="fact-sort-button"
                >
                    <div className="active-blue">Fact { this.renderSortButton(factSort) }</div>
                </th>
                <th
                    className="state-header sticky-column fixed-column-2 pointer right-border sticky-header"
                    key='state-header'
                    id={ stateSort || 'disabled' }
                    data-ouia-component-type='PF4/Button'
                    data-ouia-component-id='state-sort-button'
                    onClick={ () => this.toggleSort('state', stateSort) }
                >
                    { stateSort !== ''
                        ? <div className="active-blue">State { this.renderSortButton(stateSort) }</div>
                        : <div>State { this.renderSortButton(stateSort) }</div>
                    }
                </th>
                { masterList.length ? this.renderSystemHeaders() : this.renderLoadingSystems() }
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
    hasHSPReadPermissions: PropTypes.bool,
    masterList: PropTypes.array,
    permissions: PropTypes.object,
    referenceId: PropTypes.string,
    removeSystem: PropTypes.func,
    stateSort: PropTypes.string,
    systemIds: PropTypes.array,
    toggleFactSort: PropTypes.func,
    toggleStateSort: PropTypes.func,
    updateReferenceId: PropTypes.func,
    setHistory: PropTypes.func,
    selectedHSPIds: PropTypes.array,
    selectHistoricProfiles: PropTypes.func,
    selectedBaselineIds: PropTypes.array,
    columnWidth: PropTypes.number,
    setColumnHeaderWidth: PropTypes.func.isRequired
};

export default ComparisonHeader;
