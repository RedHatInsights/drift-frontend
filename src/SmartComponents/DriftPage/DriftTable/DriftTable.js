import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title, Tooltip } from '@patternfly/react-core';
import queryString from 'query-string';
import { CloseIcon, AngleDownIcon, AngleRightIcon, AngleUpIcon, CubesIcon,
    ServerIcon, AddCircleOIcon, WarningTriangleIcon } from '@patternfly/react-icons';
import { Skeleton, SkeletonSize } from '@red-hat-insights/insights-frontend-components';

import AddSystemModal from '../../AddSystemModal/AddSystemModal';
import './drift-table.scss';
import { compareActions } from '../../modules';
import StateIcon from '../../StateIcon/StateIcon';
import AddSystemButton from '../AddSystemButton/AddSystemButton';

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
        this.systemIds = this.systemIds.filter(item => item !== systemId);
        if (this.systemIds.length > 0) {
            this.fetchCompare(this.systemIds);
        } else {
            this.setHistory([]);
            this.props.clearState();
        }
    }

    fetchCompare(systemIds) {
        if (systemIds.length > 0) {
            this.systemIds = systemIds;
            this.setHistory(systemIds);
            this.props.fetchCompare(systemIds);
        }
    }

    setHistory(systemIds) {
        /*eslint-disable camelcase*/
        this.props.history.push({
            search: '?' + queryString.stringify({ system_ids: systemIds })
        });
        /*eslint-enable camelcase*/
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
                        'nested-fact stick-column fixed-column-1' :
                        'sticky-column fixed-column-1' }>
                    { this.renderExpandableRowButton(this.props.expandedRows, fact.name) } { fact.name }
                </td>
            );
            row.push(<td className="fact-state sticky-column fixed-column-2"><StateIcon factState={ fact.state }/></td>);

            for (let i = 0; i < systems.length + 1; i += 1) {
                row.push(<td></td>);
            }

            rows.push(<tr>{ row }</tr>);

            fact.comparisons.sort(function(a, b) {
                if (a.name > b.name) {
                    return 1;
                }
                else if (a.name < b.name) {
                    return -1;
                }
                else {
                    return 0;
                }
            });

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

    renderHeaderRow(systems) {
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
                        { systems[i].system_profile_exists ?
                            <div>{ this.formatDate(systems[i].last_updated) }</div> :
                            <Tooltip
                                position='top'
                                content={
                                    <div>System profile does not exist. Please run insights-client on system to upload archive.</div>
                                }
                            >
                                <WarningTriangleIcon /> { this.formatDate(systems[i].last_updated) }
                            </Tooltip>
                        }
                    </div>
                </th>
            );
        }

        return row;
    }

    renderSortButton(sort) {
        let sortIcon;

        if (sort === 'asc') {
            sortIcon = <AngleUpIcon className="pointer active-blue" onClick={ () => this.props.toggleFactSort('desc') }/>;
        }
        else if (sort === 'desc') {
            sortIcon = <AngleDownIcon className="pointer active-blue" onClick={ () => this.props.toggleFactSort('asc') }/>;
        }

        return sortIcon;
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
                    <EmptyStateIcon icon={ CubesIcon } />
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
                            <tr className="fact-header-cell">
                                <td className="fact-header sticky-column fixed-column-1">
                                    <div>Fact { this.renderSortButton(this.props.sort) }</div>
                                </td>
                                <th className="state-header sticky-column fixed-column-2">
                                    <div>State</div>
                                </th>
                                { this.renderHeaderRow(systems) }
                                <th>
                                    { loading ? <Skeleton size={ SkeletonSize.lg } /> : this.renderAddSystem() }
                                </th>
                            </tr>
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
        const { filteredCompareData, systems, loading } = this.props;

        return (
            <React.Fragment>
                <AddSystemModal
                    selectedSystemIds={ systems.map(system => system.id) }
                    showModal={ this.props.addSystemModalOpened }
                    confirmModal={ this.fetchCompare }
                />
                { systems.length > 0 || loading ?
                    this.renderTable(filteredCompareData, systems, loading) : this.renderEmptyState()
                }
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        fullCompareData: state.compareReducer.fullCompareData,
        filteredCompareData: state.compareReducer.filteredCompareData,
        addSystemModalOpened: state.addSystemModalReducer.addSystemModalOpened,
        stateFilter: state.compareReducer.stateFilter,
        factFilter: state.compareReducer.factFilter,
        loading: state.compareReducer.loading,
        systems: state.compareReducer.systems,
        sort: state.compareReducer.sort,
        expandedRows: state.compareReducer.expandedRows
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompare: ((systemIds) => dispatch(compareActions.fetchCompare(systemIds))),
        toggleFactSort: ((sortType) => dispatch(compareActions.toggleFactSort(sortType))),
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
    sort: PropTypes.string,
    loading: PropTypes.bool,
    toggleFactSort: PropTypes.func,
    expandRow: PropTypes.func,
    expandRows: PropTypes.func,
    expandedRows: PropTypes.array
};

export default withRouter (connect(mapStateToProps, mapDispatchToProps)(DriftTable));
