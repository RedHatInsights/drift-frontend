import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title, Tooltip } from '@patternfly/react-core';
import queryString from 'query-string';
import { AngleDownIcon, AngleRightIcon, LongArrowAltUpIcon, LongArrowAltDownIcon, ArrowsAltVIcon,
    TimesIcon, ExclamationTriangleIcon, PlusCircleIcon, ServerIcon, BlueprintIcon } from '@patternfly/react-icons';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import moment from 'moment';

import AddSystemModal from '../../AddSystemModal/AddSystemModal';
import AddSystemButton from '../AddSystemButton/AddSystemButton';
import StateIcon from '../../StateIcon/StateIcon';
import { ASC, DESC } from '../../../constants';
import { setHistory } from '../../../Utilities/SetHistory';

import HistoricalProfilesDropdown from '../../HistoricalProfilesDropdown/HistoricalProfilesDropdown';
import { compareActions } from '../../modules';
import { baselinesTableActions } from '../../BaselinesTable/redux';
import { historicProfilesActions } from '../../HistoricalProfilesDropdown/redux';

class DriftTable extends Component {
    constructor(props) {
        super(props);
        this.setSystemIds();
        this.setBaselineIds();
        this.setHSPIds();
        this.fetchCompare = this.fetchCompare.bind(this);
        this.removeSystem = this.removeSystem.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
        const { fetchCompare } = this.props;

        fetchCompare(this.systemIds, this.baselineIds, this.HSPIds);
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
    }

    setHSPIds() {
        const { selectHistoricProfile } = this.props;

        this.HSPIds = queryString.parse(this.props.location.search).hsp_ids;
        this.HSPIds = Array.isArray(this.HSPIds) ? this.HSPIds : [ this.HSPIds ];
        this.HSPIds = this.HSPIds.filter(item => item !== undefined);
        selectHistoricProfile(this.HSPIds);
    }

    formatDate(dateString) {
        return moment.utc(dateString).format('DD MMM YYYY, HH:mm UTC');
    }

    removeSystem = (systemBaseline) => {
        const { history, clearState, setSelectedBaselines, stateFilters, addStateFilter, hspIds, selectHistoricProfile } = this.props;
        const newSystemIds = [];

        this.systemIds.forEach((system) => {
            if (system === systemBaseline.id) {
                hspIds.forEach((systemProfile) => {
                    if (systemProfile.display_name === systemBaseline.display_name) {
                        this.HSPIds = this.HSPIds.filter(item => item !== systemProfile.id);
                    }
                });
            } else {
                newSystemIds.push(system);
            }
        });

        this.systemIds = newSystemIds;
        this.baselineIds = this.baselineIds.filter(item => item !== systemBaseline.id);
        this.HSPIds = this.HSPIds.filter(item => item !== systemBaseline.id);

        if ((this.systemIds.length + this.baselineIds.length + this.HSPIds.length) === 1) {
            stateFilters.forEach((stateFilter) => {
                if (stateFilter.selected === false) {
                    addStateFilter(stateFilter);
                }
            });
        }

        if (this.systemIds.length > 0 || this.baselineIds.length > 0 || this.HSPIds.length > 0) {
            this.fetchCompare(this.systemIds, this.baselineIds, this.HSPIds);
        } else {
            setHistory(history, []);
            clearState();
        }

        selectHistoricProfile([ systemBaseline.id ]);
        setSelectedBaselines(this.baselineIds);
    }

    fetchCompare(systemIds, baselineIds, HSPIds) {
        this.systemIds = systemIds;
        this.baselineIds = baselineIds;
        this.HSPIds = HSPIds;

        if (systemIds.length > 0 || baselineIds.length > 0 || HSPIds.length > 0) {
            setHistory(this.props.history, systemIds, baselineIds, HSPIds);
            this.props.fetchCompare(systemIds, baselineIds, HSPIds);
        }
    }

    renderRows(facts, systems, baselines, hspIds) {
        let rows = [];
        let rowData = [];

        if (facts !== undefined) {
            for (let i = 0; i < facts.length; i += 1) {
                rowData = this.renderRowData(facts[i], systems, baselines, hspIds);
                rows.push(rowData);
            }
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

    findSystem(fact, systemsBaselinesList) {
        let row = [];

        for (let i = 0; i < systemsBaselinesList.length; i += 1) {
            let system = fact.systems.find(function(system) {
                return system.id === systemsBaselinesList[i].id;
            });
            row.push(
                <td className={ fact.state === 'DIFFERENT' ? 'highlight comparison-cell' : 'comparison-cell' }>
                    { system.value === null ? 'No Data' : system.value }
                </td>
            );
        }

        return row;
    }

    renderRowData(fact, systems, baselines, hspIds) {
        let row = [];
        let rows = [];
        let baselineSystemCount = systems.length + baselines.length + hspIds.length;

        if (fact.comparisons) {
            row.push(
                <td className={
                    this.props.expandedRows.includes(fact.name) ?
                        'nested-fact sticky-column fixed-column-1' :
                        'sticky-column fixed-column-1' }>
                    { this.renderExpandableRowButton(this.props.expandedRows, fact.name) } { fact.name }
                </td>
            );
            row.push(<td className="fact-state sticky-column fixed-column-2"><StateIcon factState={ fact.state }/></td>);

            for (let i = 0; i < baselineSystemCount; i += 1) {
                row.push(<td className="comparison-cell"></td>);
            }

            rows.push(<tr>{ row }</tr>);

            if (this.props.expandedRows.includes(fact.name)) {
                for (let i = 0; i < fact.comparisons.length; i++) {
                    row = this.renderRowChild(fact.comparisons[i], systems, baselines, hspIds);
                    rows.push(<tr>{ row }</tr>);
                }
            }
        } else {
            row.push(<td className="sticky-column fixed-column-1">{ fact.name }</td>);
            row.push(<td className="fact-state sticky-column fixed-column-2"><StateIcon factState={ fact.state }/></td>);

            row = row.concat(this.findSystem(fact, baselines, 'baselines'));
            row = row.concat(this.findSystem(fact, systems, 'systems'));
            row = row.concat(this.findSystem(fact, hspIds, 'system profiles'));

            rows.push(<tr>{ row }</tr>);
        }

        return rows;
    }

    renderRowChild(fact, systems, baselines, hspIds) {
        let row = [];

        row.push(<td className="nested-fact sticky-column fixed-column-1">
            <p className="child-row">{ fact.name }</p>
        </td>);
        row.push(<td className="fact-state sticky-column fixed-column-2"><StateIcon factState={ fact.state }/></td>);

        row = row.concat(this.findSystem(fact, baselines, 'baselines'));
        row = row.concat(this.findSystem(fact, systems, 'systems'));
        row = row.concat(this.findSystem(fact, hspIds, 'system profiles'));

        return row;
    }

    addSystems(data) {
        let row = [];
        let type = '';

        for (let i = 0; i < data.length; i++) {
            type = data[i].type;

            row.push(
                <th key={ data[i].id } className={ data[i].type + '-header drift-header' }>
                    <div>
                        <a onClick={ () => this.removeSystem(data[i]) } className="remove-system-icon">
                            <TimesIcon/>
                        </a>
                    </div>
                    <div className={ type === 'baselines' ? 'comparison-header' : 'comparison-header' }>
                        <div>
                            { type === 'baseline' ? <BlueprintIcon/> : <ServerIcon/> }
                            <span className="system-name">{ data[i].display_name }</span>
                        </div>
                        <div className="system-updated">
                            { data[i].system_profile_exists === false ?
                                <Tooltip
                                    position='top'
                                    content={
                                        <div>System profile does not exist. Please run insights-client on system to upload archive.</div>
                                    }
                                >
                                    <ExclamationTriangleIcon color="#f0ab00"/>
                                </Tooltip> : ''
                            }
                            { data[i].last_updated
                                ? this.formatDate(data[i].last_updated)
                                : this.formatDate(data[i].updated)
                            }
                            { insights.chrome.isBeta()
                                ? data[i].type === 'system'
                                    ? <HistoricalProfilesDropdown systemId={ data[i].id } fetchCompare={ this.fetchCompare }/>
                                    : null
                                : null
                            }
                        </div>
                    </div>
                </th>
            );
        }

        return row;
    }

    renderSystems(systems, baselines, hspIds) {
        let baselinesList = [];
        let systemsList = [];
        let row = [];
        let fullHistoricalSystemList = [];

        if (systems.length === 0 && baselines.length === 0 && hspIds.length === 0) {
            return row;
        }

        let modifiedSystems = systems.map(function(system) {
            system.type = 'system';
            return system;
        });
        let modifiedBaselines = baselines.map(function(baseline) {
            baseline.type = 'baseline';
            return baseline;
        });
        let modifiedHSPs = hspIds.map(function(hsp) {
            hsp.type = 'historical-system-profile';
            return hsp;
        });

        modifiedSystems.forEach(function(system) {
            fullHistoricalSystemList.push(system);
            modifiedHSPs.forEach(function(hsp) {
                if (hsp.display_name === system.display_name) {
                    fullHistoricalSystemList.push(hsp);
                }
            });
        });

        baselinesList = this.addSystems(modifiedBaselines);
        systemsList = this.addSystems(fullHistoricalSystemList);

        row = baselinesList.concat(systemsList);

        return row;
    }

    renderSortButton(sortType, sort) {
        let sortIcon;

        if (sort === ASC) {
            sortIcon = <LongArrowAltUpIcon className="pointer active-blue" onClick={ () => this.toggleSort(sortType, sort) }/>;
        }
        else if (sort === DESC) {
            sortIcon = <LongArrowAltDownIcon className="pointer active-blue" onClick={ () => this.toggleSort(sortType, sort) }/>;
        }
        else {
            sortIcon = <ArrowsAltVIcon className="pointer not-active" onClick={ () => this.toggleSort(sortType, sort) }/>;
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

    renderHeaderRow(systems, baselines, hspIds) {
        const { stateSort } = this.props;

        return (
            <tr className="sticky-column-header">
                <th className="fact-header sticky-column fixed-column-1" key='fact-header'>
                    <div className="active-blue">Fact { this.renderSortButton('fact', this.props.factSort) }</div>
                </th>
                <th className="state-header sticky-column fixed-column-2" key='state-header'>
                    { stateSort !== '' ?
                        <div className="active-blue">State { this.renderSortButton('state', this.props.stateSort) }</div> :
                        <div>State { this.renderSortButton('state', this.props.stateSort) }</div>
                    }
                </th>
                { this.renderSystems(systems, baselines, hspIds) }
            </tr>
        );
    }

    renderExpandableRowButton(expandedRows, factName) {
        let expandIcon;

        if (expandedRows.includes(factName)) {
            expandIcon = <AngleDownIcon className="pointer active-blue" onClick={ () => this.props.expandRow(factName) } />;
        } else {
            expandIcon = <AngleRightIcon className="pointer" onClick={ () => this.props.expandRow(factName) } />;
        }

        return expandIcon;
    }

    renderEmptyState() {
        return (
            <center>
                <EmptyState>
                    <EmptyStateIcon icon={ PlusCircleIcon } />
                    <br></br>
                    <Title size="lg">Add systems or baselines to compare</Title>
                    <EmptyStateBody>
                        You currently have no systems or baselines displayed. Add at least two
                        <br></br>
                        systems or baselines to compare their facts.
                    </EmptyStateBody>
                    <AddSystemButton isTable={ false }/>
                </EmptyState>
            </center>
        );
    }

    renderTable(compareData, systems, baselines, hspIds, loading) {
        return (
            <React.Fragment>
                <div className="drift-table-wrapper">
                    <table className="pf-c-table pf-m-compact drift-table">
                        <thead>
                            { this.renderHeaderRow(systems, baselines, hspIds, loading) }
                        </thead>
                        <tbody>
                            { loading ? this.renderLoadingRows() : this.renderRows(compareData, systems, baselines, hspIds) }
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const { fullCompareData, filteredCompareData, systems, baselines, hspIds, loading } = this.props;

        return (
            <React.Fragment>
                <AddSystemModal
                    selectedSystemIds={ systems.map(system => system.id) }
                    confirmModal={ this.fetchCompare }
                />
                {
                    systems.length > 0 ||
                    baselines.length > 0 ||
                    hspIds.length > 0 ||
                    loading ||
                    (fullCompareData.length !== 0 && this.systemIds.length !== 0)
                        ? this.renderTable(filteredCompareData, systems, baselines, hspIds, loading) : this.renderEmptyState()
                }
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        fullCompareData: state.compareState.fullCompareData,
        filteredCompareData: state.compareState.filteredCompareData,
        addSystemModalOpened: state.addSystemModalOpened,
        stateFilters: state.compareState.stateFilters,
        factFilter: state.compareState.factFilter,
        loading: state.compareState.loading,
        systems: state.compareState.systems,
        baselines: state.compareState.baselines,
        hspIds: state.compareState.hspIds,
        factSort: state.compareState.factSort,
        stateSort: state.compareState.stateSort,
        expandedRows: state.compareState.expandedRows,
        selectedHSPIds: state.historicProfilesState.selectedHSPIds
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompare: (systemIds, baselineIds, hspIds) => dispatch(compareActions.fetchCompare(systemIds, baselineIds, hspIds)),
        toggleFactSort: (sortType) => dispatch(compareActions.toggleFactSort(sortType)),
        toggleStateSort: (sortType) => dispatch(compareActions.toggleStateSort(sortType)),
        expandRow: (factName) => dispatch(compareActions.expandRow(factName)),
        clearState: () => dispatch(compareActions.clearState()),
        setSelectedBaselines: (selectedBaselineIds) => dispatch(baselinesTableActions.setSelectedBaselines(selectedBaselineIds)),
        addStateFilter: (filter) => dispatch(compareActions.addStateFilter(filter)),
        selectHistoricProfile: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfile(historicProfileIds))
    };
}

DriftTable.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    fetchCompare: PropTypes.func,
    clearState: PropTypes.func,
    fullCompareData: PropTypes.array,
    filteredCompareData: PropTypes.array,
    systems: PropTypes.array,
    baselines: PropTypes.array,
    hspIds: PropTypes.array,
    addSystemModalOpened: PropTypes.bool,
    stateFilters: PropTypes.array,
    factFilter: PropTypes.string,
    factSort: PropTypes.string,
    stateSort: PropTypes.string,
    loading: PropTypes.bool,
    toggleFactSort: PropTypes.func,
    toggleStateSort: PropTypes.func,
    expandRow: PropTypes.func,
    expandRows: PropTypes.func,
    expandedRows: PropTypes.array,
    setSelectedBaselines: PropTypes.func,
    addStateFilter: PropTypes.func,
    selectHistoricProfile: PropTypes.func,
    selectedHSPIds: PropTypes.array
};

export default withRouter (connect(mapStateToProps, mapDispatchToProps)(DriftTable));
