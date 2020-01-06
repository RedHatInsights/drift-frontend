import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title, Tooltip } from '@patternfly/react-core';
import queryString from 'query-string';
import { AngleDownIcon, AngleRightIcon, LongArrowAltUpIcon, LongArrowAltDownIcon, ArrowsAltVIcon,
    CloseIcon, ExclamationTriangleIcon, PlusCircleIcon, ServerIcon } from '@patternfly/react-icons';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import moment from 'moment';

import AddSystemModal from '../../AddSystemModal/AddSystemModal';
import AddSystemButton from '../AddSystemButton/AddSystemButton';
import StateIcon from '../../StateIcon/StateIcon';
import './drift-table.scss';
import { ASC, DESC } from '../../../constants';
import { setHistory } from '../../../Utilities/SetHistory';

import HistoricalProfilesDropdown from '../../HistoricalProfilesDropdown/HistoricalProfilesDropdown';
import { compareActions } from '../../modules';
import { baselinesTableActions } from '../../BaselinesTable/redux';

class DriftTable extends Component {
    constructor(props) {
        super(props);
        this.setSystemIds();
        this.setBaselineIds();
        this.setPITIds();
        this.fetchCompare = this.fetchCompare.bind(this);
        this.removeSystem = this.removeSystem.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
        const { fetchCompare } = this.props;

        fetchCompare(this.systemIds, this.baselineIds, this.PITIds);
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

    setPITIds() {
        this.PITIds = queryString.parse(this.props.location.search).pit_ids;
        this.PITIds = Array.isArray(this.PITIds) ? this.PITIds : [ this.PITIds ];
        this.PITIds = this.PITIds.filter(item => item !== undefined);
    }

    formatDate(dateString) {
        return moment.utc(dateString).format('DD MMM YYYY, HH:mm UTC');
    }

    removeSystem(systemBaselineId) {
        const { history, clearState, setSelectedBaselines, stateFilters, addStateFilter } = this.props;

        this.systemIds = this.systemIds.filter(item => item !== systemBaselineId);
        this.baselineIds = this.baselineIds.filter(item => item !== systemBaselineId);

        if (this.systemIds.length + this.baselineIds.length === 1) {
            stateFilters.forEach(function(stateFilter) {
                if (stateFilter.selected === false) {
                    addStateFilter(stateFilter);
                }
            });
        }

        if (this.systemIds.length > 0 || this.baselineIds.length > 0) {
            this.fetchCompare(this.systemIds, this.baselineIds);
        } else {
            setHistory(history, []);
            clearState();
        }

        setSelectedBaselines(this.baselineIds);
    }

    fetchCompare(systemIds, baselineIds) {
        this.systemIds = systemIds;
        this.baselineIds = baselineIds;

        if (systemIds.length > 0 || baselineIds.length > 0) {
            setHistory(this.props.history, systemIds, baselineIds);
            this.props.fetchCompare(systemIds, baselineIds);
        }
    }

    renderRows(facts, systems, baselines) {
        let rows = [];
        let rowData = [];

        if (facts !== undefined) {
            for (let i = 0; i < facts.length; i += 1) {
                rowData = this.renderRowData(facts[i], systems, baselines);
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
                <td className={ fact.state === 'DIFFERENT' ? 'highlight' : '' }>
                    { system.value === null ? 'No Data' : system.value }
                </td>
            );
        }

        return row;
    }

    renderRowData(fact, systems, baselines) {
        let row = [];
        let rows = [];
        let baselineSystemCount = systems.length + baselines.length;

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

            for (let i = 0; i < baselineSystemCount + 1; i += 1) {
                row.push(<td></td>);
            }

            rows.push(<tr>{ row }</tr>);

            if (this.props.expandedRows.includes(fact.name)) {
                for (let i = 0; i < fact.comparisons.length; i++) {
                    row = this.renderRowChild(fact.comparisons[i], systems, baselines);
                    rows.push(<tr>{ row }</tr>);
                }
            }
        } else {
            row.push(<td className="sticky-column fixed-column-1">{ fact.name }</td>);
            row.push(<td className="fact-state sticky-column fixed-column-2"><StateIcon factState={ fact.state }/></td>);

            row = row.concat(this.findSystem(fact, baselines, 'baselines'));
            row = row.concat(this.findSystem(fact, systems, 'systems'));

            row.push(<td className={ fact.state === 'DIFFERENT' ? 'highlight' : '' }></td>);
            rows.push(<tr>{ row }</tr>);
        }

        return rows;
    }

    renderRowChild(fact, systems, baselines) {
        let row = [];

        row.push(<td className="nested-fact sticky-column fixed-column-1">
            <p className="child-row">{ fact.name }</p>
        </td>);
        row.push(<td className="fact-state sticky-column fixed-column-2"><StateIcon factState={ fact.state }/></td>);

        row = row.concat(this.findSystem(fact, baselines, 'baselines'));
        row = row.concat(this.findSystem(fact, systems, 'systems'));

        row.push(<td className={ fact.state === 'DIFFERENT' ? 'highlight' : '' }></td>);

        return row;
    }

    addSystems(data, type) {
        let row = [];

        for (let i = 0; i < data.length; i++) {
            row.push(
                <th>
                    <div className={ type === 'baselines' ? 'baseline-header' : 'system-header' }>
                        <a onClick={ () => this.removeSystem(data[i].id) }>
                            <CloseIcon className="remove-system-icon"/>
                        </a>
                        <ServerIcon className="cluster-icon-large"/>
                        <div className="system-name">{ data[i].display_name }</div>
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
                                ? type === 'systems' ? <HistoricalProfilesDropdown systemId={ data[i].id }/> : null
                                : null
                            }
                        </div>
                    </div>
                </th>
            );
        }

        return row;
    }

    renderSystems(systems, baselines) {
        let baselinesList = [];
        let systemsList = [];
        let row = [];

        if (systems === undefined && baselines === undefined) {
            return row;
        }

        baselinesList = this.addSystems(baselines, 'baselines');
        systemsList = this.addSystems(systems, 'systems');

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

    renderHeaderRow(systems, baselines, loading) {
        const { stateSort } = this.props;

        return (
            <tr className="sticky-column-header">
                <th className="fact-header sticky-column fixed-column-1">
                    <div className="active-blue">Fact { this.renderSortButton('fact', this.props.factSort) }</div>
                </th>
                <th className="state-header sticky-column fixed-column-2">
                    { stateSort !== '' ?
                        <div className="active-blue">State { this.renderSortButton('state', this.props.stateSort) }</div> :
                        <div>State { this.renderSortButton('state', this.props.stateSort) }</div>
                    }
                </th>
                { this.renderSystems(systems, baselines) }
                <th>
                    { loading ? <Skeleton size={ SkeletonSize.lg } /> : this.renderAddSystem() }
                </th>
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

    renderAddSystem() {
        return (
            <div className="add-system-header">
                <div className="add-system-icon">
                    <PlusCircleIcon/>
                </div>
                <AddSystemButton isTable={ true }/>
            </div>
        );
    }

    renderTable(compareData, systems, baselines, loading) {
        return (
            <React.Fragment>
                <div className="drift-table-wrapper">
                    <table className="pf-c-table ins-c-table pf-m-compact ins-entity-table drift-table">
                        <thead>
                            { this.renderHeaderRow(systems, baselines, loading) }
                        </thead>
                        <tbody>
                            { loading ? this.renderLoadingRows() : this.renderRows(compareData, systems, baselines) }
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const { fullCompareData, filteredCompareData, systems, baselines, loading } = this.props;

        return (
            <React.Fragment>
                <AddSystemModal
                    selectedSystemIds={ systems.map(system => system.id) }
                    confirmModal={ this.fetchCompare }
                />
                { systems.length > 0 || baselines.length > 0 || loading || (fullCompareData.length !== 0 && this.systemIds.length !== 0) ?
                    this.renderTable(filteredCompareData, systems, baselines, loading) : this.renderEmptyState()
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
        factSort: state.compareState.factSort,
        stateSort: state.compareState.stateSort,
        expandedRows: state.compareState.expandedRows
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompare: (systemIds, baselineIds, PITIds) => dispatch(compareActions.fetchCompare(systemIds, baselineIds, PITIds)),
        toggleFactSort: (sortType) => dispatch(compareActions.toggleFactSort(sortType)),
        toggleStateSort: (sortType) => dispatch(compareActions.toggleStateSort(sortType)),
        expandRow: (factName) => dispatch(compareActions.expandRow(factName)),
        clearState: () => dispatch(compareActions.clearState()),
        setSelectedBaselines: (selectedBaselineIds) => dispatch(baselinesTableActions.setSelectedBaselines(selectedBaselineIds)),
        addStateFilter: (filter) => dispatch(compareActions.addStateFilter(filter))
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
    addSystemModalOpened: PropTypes.bool,
    stateFilters: PropTypes.string,
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
    addStateFilter: PropTypes.func
};

export default withRouter (connect(mapStateToProps, mapDispatchToProps)(DriftTable));
