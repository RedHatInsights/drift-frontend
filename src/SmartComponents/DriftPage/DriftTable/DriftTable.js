import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { DropdownDirection, Tooltip } from '@patternfly/react-core';
import queryString from 'query-string';
import { ClockIcon, TimesIcon, ExclamationTriangleIcon, ServerIcon, BlueprintIcon } from '@patternfly/react-icons';
import { AngleDownIcon, AngleRightIcon, LongArrowAltUpIcon, LongArrowAltDownIcon, ArrowsAltVIcon } from '@patternfly/react-icons';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import moment from 'moment';

import AddSystemModal from '../../AddSystemModal/AddSystemModal';
import StateIcon from '../../StateIcon/StateIcon';
import { ASC, DESC } from '../../../constants';
import { setHistory } from '../../../Utilities/SetHistory';

import HistoricalProfilesDropdown from '../../HistoricalProfilesDropdown/HistoricalProfilesDropdown';
import { compareActions } from '../../modules';
import { baselinesTableActions } from '../../BaselinesTable/redux';
import { historicProfilesActions } from '../../HistoricalProfilesDropdown/redux';
import ReferenceSelector from './ReferenceSelector/ReferenceSelector';

export class DriftTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            emptyStateMessage: [
                'You currently have no system or baselines displayed. Add at least two',
                'systems or baselines to compare their facts.'
            ]
        };

        this.masterList = [];

        this.setSystemIds();
        this.setBaselineIds();
        this.setHSPIds();
        this.setReferenceId();
        this.fetchCompare = this.fetchCompare.bind(this);
        this.removeSystem = this.removeSystem.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
        const { fetchCompare } = this.props;

        if (this.systemIds.length > 0 || this.baselineIds.length > 0 || this.HSPIds.length > 0) {
            fetchCompare(this.systemIds, this.baselineIds, this.HSPIds, this.props.referenceId);
        }
    }

    shiftReferenceToFront = (masterList) => {
        let index;
        let systemToMove;

        index = masterList.findIndex((item) => {
            return item.id === this.props.referenceId;
        });

        systemToMove = masterList.splice(index, 1);
        masterList.unshift(systemToMove[0]);

        return masterList;
    }

    formatEntities(systems, baselines, historicalProfiles) {
        /*eslint-disable camelcase*/
        let fullHistoricalSystemList = [];
        let historicalGroups = {};
        let masterList;

        if (systems.length === 0 && baselines.length === 0 && historicalProfiles.length === 0) {
            return [];
        }

        systems = systems.map(function(system) {
            system.type = 'system';
            return system;
        });
        baselines = baselines.map(function(baseline) {
            baseline.type = 'baseline';
            return baseline;
        });
        historicalProfiles = historicalProfiles.map(function(hsp) {
            hsp.type = 'historical-system-profile';
            return hsp;
        });

        historicalProfiles.forEach(function(hsp) {
            if (historicalGroups.hasOwnProperty(hsp.system_id)) {
                historicalGroups[hsp.system_id].push(hsp);
            } else {
                historicalGroups[hsp.system_id] = [ hsp ];
            }
        });

        fullHistoricalSystemList = systems;

        for (const [ system_id, hsps ] of Object.entries(historicalGroups)) {
            let system = systems.find(item => system_id === item.id);
            let index;

            if (system !== undefined) {
                index = fullHistoricalSystemList.indexOf(system);
                fullHistoricalSystemList = [
                    ...fullHistoricalSystemList.slice(0, index + 1),
                    ...hsps,
                    ...fullHistoricalSystemList.slice(index + 1, fullHistoricalSystemList.length)
                ];
            } else {
                fullHistoricalSystemList = fullHistoricalSystemList.concat(hsps);
            }
        }
        /*eslint-enable camelcase*/

        masterList = baselines.concat(fullHistoricalSystemList);

        if (this.props.referenceId) {
            masterList = this.shiftReferenceToFront(masterList);
        }

        return masterList;
    }

    setSystemIds() {
        this.systemIds = queryString.parse(this.props.location.search).system_ids;
        this.systemIds = Array.isArray(this.systemIds) ? this.systemIds : [ this.systemIds ];
        this.systemIds = this.systemIds.filter(item => item !== undefined);
    }

    setBaselineIds() {
        this.baselineIds = queryString.parse(this.props.location.search).baseline_ids;
        this.baselineIds = Array.isArray(this.baselineIds) ? this.baselineIds : [ this.baselineIds ];
        this.baselineIds = this.baselineIds.filter(item => item !== undefined);
        this.props.setSelectedBaselines(this.baselineIds, 'CHECKBOX');
    }

    setHSPIds() {
        const { selectHistoricProfiles } = this.props;

        this.HSPIds = queryString.parse(this.props.location.search).hsp_ids;
        this.HSPIds = Array.isArray(this.HSPIds) ? this.HSPIds : [ this.HSPIds ];
        this.HSPIds = this.HSPIds.filter(item => item !== undefined);
        selectHistoricProfiles(this.HSPIds);
    }

    setReferenceId() {
        this.props.updateReferenceId(queryString.parse(this.props.location.search).reference_id);
    }

    updateReferenceId = (id) => {
        this.fetchCompare(this.systemIds, this.baselineIds, this.HSPIds, id);
    }

    formatDate(dateString) {
        return moment.utc(dateString).format('DD MMM YYYY, HH:mm UTC');
    }

    async removeSystem(item) {
        const { selectHistoricProfiles } = this.props;

        if (item.type === 'system') {
            this.systemIds = this.systemIds.filter(id => id !== item.id);

            this.HSPIds = this.props.historicalProfiles.filter((profile) => {
                return profile.system_id !== item.id;
            }).map(profile => profile.id);

        } else if (item.type === 'baseline') {
            this.baselineIds = this.baselineIds.filter(id => id !== item.id);
        } else if (item.type === 'historical-system-profile') {
            this.HSPIds = this.HSPIds.filter(id => id !== item.id);
        }

        if (item.id === this.props.referenceId) {
            await this.props.updateReferenceId();
        }

        selectHistoricProfiles(this.HSPIds);
        this.fetchCompare(this.systemIds, this.baselineIds, this.HSPIds, this.props.referenceId);
    }

    fetchCompare(systemIds, baselineIds, HSPIds, referenceId) {
        this.systemIds = systemIds;
        this.baselineIds = baselineIds;
        this.HSPIds = HSPIds;

        setHistory(this.props.history, systemIds, baselineIds, HSPIds, referenceId);
        this.props.setSelectedBaselines(this.baselineIds, 'CHECKBOX');
        this.props.updateReferenceId(referenceId);
        this.props.fetchCompare(systemIds, baselineIds, HSPIds, referenceId);
    }

    renderRows(facts) {
        let rows = [];

        if (facts !== undefined) {
            facts.forEach(fact => {
                rows.push(this.renderRow(fact));
            });
        }

        return rows;
    }

    renderLoadingRows() {
        let rows = [];
        let rowData = [];

        for (let i = 0; i < 3; i += 1) {
            rowData.push(<td><Skeleton size={ SkeletonSize.md } /></td>);
        }

        for (let i = 0; i < 10; i += 1) {
            rows.push(<tr>{ rowData }</tr>);
        }

        return rows;
    }

    findSystem(fact) {
        let row = [];
        let system = undefined;
        let className;

        this.masterList.forEach(item => {
            className = [ 'comparison-cell' ];
            system = fact.systems.find(function(sys) {
                return sys.id === item.id;
            });

            if (this.props.referenceId) {
                if (system.state === 'DIFFERENT') {
                    className.push('highlight');
                    className.push('different-fact-cell');
                }
            } else {
                if (fact.state === 'DIFFERENT') {
                    className.push('highlight');
                }
            }

            row.push(<td className={ className.join(' ') }>{ system.value === null ? 'No Data' : system.value }</td>);
        });

        return row;
    }

    renderRow(fact) {
        let row = [];
        let rows = [];

        if (fact.comparisons) {
            row.push(
                <td className={
                    this.props.expandedRows.includes(fact.name) ?
                        'nested-fact sticky-column fixed-column-1' :
                        'sticky-column fixed-column-1' }>
                    { this.renderExpandableRowButton(this.props.expandedRows, fact.name) } { fact.name }
                </td>
            );
            row.push(
                <td className="fact-state sticky-column fixed-column-2">
                    <StateIcon factState={ fact.state }/>
                </td>
            );

            this.masterList.forEach(() => {
                row.push(<td className="comparison-cell"></td>);
            });

            rows.push(<tr>{ row }</tr>);

            if (this.props.expandedRows.includes(fact.name)) {
                fact.comparisons.forEach(comparison => {
                    row = this.renderRowChild(comparison);
                    rows.push(<tr className={ comparison.state === 'DIFFERENT' ? 'unexpected-row' : '' }>{ row }</tr>);
                });
            }
        } else {
            row.push(<td className="sticky-column fixed-column-1">{ fact.name }</td>);
            row.push(
                <td className="fact-state sticky-column fixed-column-2">
                    <StateIcon factState={ fact.state }/>
                </td>
            );

            row = row.concat(this.findSystem(fact));

            rows.push(<tr className={ fact.state === 'DIFFERENT' ? 'unexpected-row' : '' }>{ row }</tr>);
        }

        return rows;
    }

    renderRowChild(fact) {
        let row = [];

        row.push(<td className="nested-fact sticky-column fixed-column-1">
            <p className="child-row">{ fact.name }</p>
        </td>);
        row.push(<td className="fact-state sticky-column fixed-column-2"><StateIcon factState={ fact.state }/></td>);

        row = row.concat(this.findSystem(fact));

        return row;
    }

    renderSystemHeaders() {
        let row = [];
        let typeIcon = '';
        let referenceId = this.props.referenceId;
        let updateReferenceId = this.updateReferenceId;

        this.masterList.forEach(item => {
            if (item.type === 'system') {
                typeIcon = <ServerIcon/>;
            } else if (item.type === 'baseline') {
                typeIcon = <BlueprintIcon/>;
            } else if (item.type === 'historical-system-profile') {
                typeIcon = <ClockIcon />;
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
                        <a onClick={ () => this.removeSystem(item) } className="remove-system-icon">
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
                                id={ item.id }
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
                                ? <HistoricalProfilesDropdown
                                    system={ item }
                                    systemIds={ this.systemIds }
                                    referenceId={ referenceId }
                                    fetchCompare={ this.fetchCompare }
                                    dropdownDirection={ DropdownDirection.down }
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
        if (sortType === 'fact') {
            this.props.toggleFactSort(sort);
        } else {
            this.props.toggleStateSort(sort);
        }
    }

    renderHeaderRow() {
        const { stateSort } = this.props;

        return (
            <tr className="sticky-column-header">
                <th
                    className="fact-header sticky-column fixed-column-1 pointer"
                    key='fact-header'
                    onClick={ () => this.toggleSort('fact', this.props.factSort) }
                >
                    <div className="active-blue">Fact { this.renderSortButton(this.props.factSort) }</div>
                </th>
                <th
                    className="state-header sticky-column fixed-column-2 pointer"
                    key='state-header'
                    onClick={ () => this.toggleSort('state', this.props.stateSort) }
                >
                    { stateSort !== '' ?
                        <div className="active-blue">State { this.renderSortButton(this.props.stateSort) }</div> :
                        <div>State { this.renderSortButton(this.props.stateSort) }</div>
                    }
                </th>
                { this.renderSystemHeaders() }
            </tr>
        );
    }

    renderExpandableRowButton(expandedRows, factName) {
        let expandIcon;

        if (expandedRows.includes(factName)) {
            expandIcon = <AngleDownIcon className="carat-margin pointer active-blue" onClick={ () => this.props.expandRow(factName) } />;
        } else {
            expandIcon = <AngleRightIcon className="carat-margin pointer" onClick={ () => this.props.expandRow(factName) } />;
        }

        return expandIcon;
    }

    renderTable(compareData, loading) {
        return (
            <React.Fragment>
                <div className="drift-table-wrapper">
                    <table className="pf-c-table pf-m-compact drift-table">
                        <thead>
                            { this.renderHeaderRow() }
                        </thead>
                        <tbody>
                            { loading ? this.renderLoadingRows() : this.renderRows(compareData) }
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const { emptyState, filteredCompareData, systems, baselines, historicalProfiles, loading } = this.props;

        this.masterList = this.formatEntities(systems, baselines, historicalProfiles);

        return (
            <React.Fragment>
                <AddSystemModal
                    selectedSystemIds={ systems.map(system => system.id) }
                    confirmModal={ this.fetchCompare }
                    referenceId={ this.props.referenceId }
                />
                { !emptyState
                    ? this.renderTable(filteredCompareData, loading)
                    : null
                }
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        addSystemModalOpened: state.addSystemModalState.addSystemModalOpened,
        fullCompareData: state.compareState.fullCompareData,
        filteredCompareData: state.compareState.filteredCompareData,
        loading: state.compareState.loading,
        systems: state.compareState.systems,
        baselines: state.compareState.baselines,
        historicalProfiles: state.compareState.historicalProfiles,
        factSort: state.compareState.factSort,
        stateSort: state.compareState.stateSort,
        expandedRows: state.compareState.expandedRows,
        emptyState: state.compareState.emptyState,
        referenceId: state.compareState.referenceId
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompare: ((systemIds, baselineIds, historicalProfiles, referenceId) =>
            dispatch(compareActions.fetchCompare(systemIds, baselineIds, historicalProfiles, referenceId))
        ),
        toggleFactSort: (sortType) => dispatch(compareActions.toggleFactSort(sortType)),
        toggleStateSort: (sortType) => dispatch(compareActions.toggleStateSort(sortType)),
        expandRow: (factName) => dispatch(compareActions.expandRow(factName)),
        setSelectedBaselines: ((selectedBaselineIds, tableId) =>
            dispatch(baselinesTableActions.setSelectedBaselines(selectedBaselineIds, tableId))
        ),
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds))
    };
}

DriftTable.propTypes = {
    addSystemModalOpened: PropTypes.bool,
    location: PropTypes.object,
    history: PropTypes.object,
    fetchCompare: PropTypes.func,
    fullCompareData: PropTypes.array,
    filteredCompareData: PropTypes.array,
    systems: PropTypes.array,
    baselines: PropTypes.array,
    historicalProfiles: PropTypes.array,
    factSort: PropTypes.string,
    stateSort: PropTypes.string,
    loading: PropTypes.bool,
    toggleFactSort: PropTypes.func,
    toggleStateSort: PropTypes.func,
    expandRow: PropTypes.func,
    expandedRows: PropTypes.array,
    setSelectedBaselines: PropTypes.func,
    selectHistoricProfiles: PropTypes.func,
    emptyState: PropTypes.bool,
    updateReferenceId: PropTypes.func,
    referenceId: PropTypes.string,
    error: PropTypes.object
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DriftTable));
