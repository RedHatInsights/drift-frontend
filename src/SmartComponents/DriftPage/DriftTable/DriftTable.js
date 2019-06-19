import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title, Tooltip } from '@patternfly/react-core';
import queryString from 'query-string';
import { AddCircleOIcon, AngleDownIcon, AngleRightIcon, LongArrowAltUpIcon, LongArrowAltDownIcon, ArrowsAltVIcon,
    CloseIcon, ServerIcon, WarningTriangleIcon } from '@patternfly/react-icons';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

import AddSystemModal from '../../AddSystemModal/AddSystemModal';
import './drift-table.scss';
import { compareActions } from '../../modules';
import StateIcon from '../../StateIcon/StateIcon';
import AddSystemButton from '../AddSystemButton/AddSystemButton';
import { ASC, DESC } from '../../../constants';
import { setHistory } from '../../../Utilities/SetHistory';

class DriftTable extends Component {
    constructor(props) {
        super(props);
        this.setSystemIds();
        this.fetchCompare = this.fetchCompare.bind(this);
        this.removeSystem = this.removeSystem.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
        this.fetchCompare(this.systemIds);
    }

    setSystemIds() {
        this.systemIds = queryString.parse(this.props.location.search).system_ids;
        this.systemIds = Array.isArray(this.systemIds) ? this.systemIds : [ this.systemIds ];
        this.systemIds = this.systemIds.filter(item => item !== undefined);
    }

    formatDate(dateString) {
        let date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    removeSystem(systemId) {
        const { history, clearState } = this.props;

        this.systemIds = this.systemIds.filter(item => item !== systemId);
        if (this.systemIds.length > 0) {
            this.fetchCompare(this.systemIds);
        } else {
            setHistory(history, []);
            clearState();
        }
    }

    fetchCompare(systemIds) {
        if (systemIds.length > 0) {
            this.systemIds = systemIds;
            setHistory(this.props.history, systemIds);
            this.props.fetchCompare(systemIds);
        }
    }

    renderRows(facts, systems) {
        let rows = [];
        let rowData = [];

        if (facts !== undefined) {
            for (let i = 0; i < facts.length; i += 1) {
                rowData = this.renderRowData(facts[i], systems);
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

    renderRowData(fact, systems) {
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
            row.push(<td className="fact-state sticky-column fixed-column-2"><StateIcon factState={ fact.state }/></td>);

            for (let i = 0; i < systems.length + 1; i += 1) {
                row.push(<td></td>);
            }

            rows.push(<tr>{ row }</tr>);

            for (let i = 0; i < fact.comparisons.length; i++) {
                row = this.renderRowChild(fact.comparisons[i], systems);
                rows.push(<tr>{ row }</tr>);
            }
        } else {
            row.push(<td className="sticky-column fixed-column-1">{ fact.name }</td>);
            row.push(<td className="fact-state sticky-column fixed-column-2"><StateIcon factState={ fact.state }/></td>);

            for (let i = 0; i < systems.length; i += 1) {
                let system = fact.systems.find(function(system) {
                    return system.id === systems[i].id;
                });
                row.push(
                    <td className={ fact.state === 'DIFFERENT' ? 'highlight' : '' }>
                        { system.value === null ? 'No Data' : system.value }
                    </td>
                );
            }

            row.push(<td className={ fact.state === 'DIFFERENT' ? 'highlight' : '' }></td>);
            rows.push(<tr>{ row }</tr>);
        }

        return rows;
    }

    renderRowChild(fact, systems) {
        let row = [];

        row.push(<td className="nested-fact sticky-column fixed-column-1">
            <p className="child-row">{ fact.name }</p>
        </td>);
        row.push(<td className="fact-state sticky-column fixed-column-2"><StateIcon factState={ fact.state }/></td>);

        for (let i = 0; i < systems.length; i += 1) {
            let system = fact.systems.find(function(system) {
                return system.id === systems[i].id;
            });
            row.push(
                <td className={ fact.state === 'DIFFERENT' ? 'highlight' : '' }>
                    { system.value === null ? 'No Data' : system.value }
                </td>
            );
        }

        row.push(<td className={ fact.state === 'DIFFERENT' ? 'highlight' : '' }></td>);

        return row;
    }

    renderSystems(systems) {
        let row = [];

        if (systems === undefined) {
            return row;
        }

        for (let i = 0; i < systems.length; i++) {
            row.push(
                <th>
                    <div className="system-header">
                        <a onClick={ () => this.removeSystem(systems[i].id) }>
                            <CloseIcon className="remove-system-icon"/>
                        </a>
                        <ServerIcon className="cluster-icon-large"/>
                        <div className="system-name">{ systems[i].display_name }</div>
                        <div className="system-updated">
                            { systems[i].system_profile_exists ?
                                '' :
                                <Tooltip
                                    position='top'
                                    content={
                                        <div>System profile does not exist. Please run insights-client on system to upload archive.</div>
                                    }
                                >
                                    <WarningTriangleIcon color="#f0ab00"/>
                                </Tooltip>
                            }
                            { this.formatDate(systems[i].last_updated) }
                        </div>
                    </div>
                </th>
            );
        }

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

    renderHeaderRow(systems, loading) {
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
                { this.renderSystems(systems) }
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
                    <EmptyStateIcon icon={ AddCircleOIcon } />
                    <br></br>
                    <Title size="lg">Add systems to compare</Title>
                    <EmptyStateBody>
                        You currently have no systems displayed.
                        <br></br>
                        Please add two or more systems to
                        <br></br>
                        compare their facts.
                    </EmptyStateBody>
                    <AddSystemButton />
                </EmptyState>
            </center>
        );
    }

    renderAddSystem() {
        return (
            <div className="add-system-header">
                <div className="add-system-icon">
                    <AddCircleOIcon/>
                </div>
                <AddSystemButton />
            </div>
        );
    }

    renderTable(compareData, systems, loading) {
        return (
            <React.Fragment>
                <div className="drift-table-wrapper">
                    <table className="pf-c-table ins-c-table pf-m-compact ins-entity-table drift-table">
                        <thead>
                            { this.renderHeaderRow(systems, loading) }
                        </thead>
                        <tbody>
                            { loading ? this.renderLoadingRows() : this.renderRows(compareData, systems) }
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const { fullCompareData, filteredCompareData, systems, loading } = this.props;

        return (
            <React.Fragment>
                <AddSystemModal
                    selectedSystemIds={ systems.map(system => system.id) }
                    confirmModal={ this.fetchCompare }
                />
                { systems.length > 0 || loading || (fullCompareData.length !== 0 && this.systemIds.length !== 0) ?
                    this.renderTable(filteredCompareData, systems, loading) : this.renderEmptyState()
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
        stateFilter: state.compareState.stateFilter,
        factFilter: state.compareState.factFilter,
        loading: state.compareState.loading,
        systems: state.compareState.systems,
        factSort: state.compareState.factSort,
        stateSort: state.compareState.stateSort,
        expandedRows: state.compareState.expandedRows
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompare: ((systemIds) => dispatch(compareActions.fetchCompare(systemIds))),
        toggleFactSort: ((sortType) => dispatch(compareActions.toggleFactSort(sortType))),
        toggleStateSort: ((sortType) => dispatch(compareActions.toggleStateSort(sortType))),
        expandRow: ((factName) => dispatch(compareActions.expandRow(factName))),
        clearState: (() => dispatch(compareActions.clearState()))
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
    addSystemModalOpened: PropTypes.bool,
    stateFilter: PropTypes.string,
    factFilter: PropTypes.string,
    factSort: PropTypes.string,
    stateSort: PropTypes.string,
    loading: PropTypes.bool,
    toggleFactSort: PropTypes.func,
    toggleStateSort: PropTypes.func,
    expandRow: PropTypes.func,
    expandRows: PropTypes.func,
    expandedRows: PropTypes.array
};

export default withRouter (connect(mapStateToProps, mapDispatchToProps)(DriftTable));
