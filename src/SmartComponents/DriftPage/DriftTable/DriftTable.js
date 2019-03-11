import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import queryString from 'query-string';
import { CubesIcon, ServerIcon, AddCircleOIcon } from '@patternfly/react-icons';
import { Skeleton, SkeletonSize } from '@red-hat-insights/insights-frontend-components';

import AddSystemModal from '../../AddSystemModal/AddSystemModal';
import TablePagination from '../Pagination/Pagination';
import './drift-table.scss';
import { compareActions } from '../../modules';
import StateIcon from '../../StateIcon/StateIcon';
import AddSystemButton from '../AddSystemButton/AddSystemButton';

class DriftTable extends Component {
    constructor(props) {
        super(props);
        this.systemIds = queryString.parse(this.props.location.search).system_ids;
        this.fetchCompare = this.fetchCompare.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
        if (this.systemIds) {
            this.fetchCompare(this.systemIds);
        }
    }

    formatDate(dateString) {
        let date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    fetchCompare(systemIds) {
        /*eslint-disable camelcase*/
        this.props.history.push({
            search: '?' + queryString.stringify({ system_ids: systemIds })
        });
        /*eslint-enable camelcase*/
        this.props.fetchCompare(systemIds);
    }

    renderRows(facts, systems) {
        let rows = [];
        let rowData = [];

        if (facts !== undefined) {
            for (let i = 0; i < facts.length; i += 1) {
                rowData = this.renderRowData(facts[i], systems);
                rows.push(<tr>{ rowData }</tr>);
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
        let tr = [];

        tr.push(<th className="fixed-column-1">{ fact.name }</th>);
        tr.push(<th className="fact-state fixed-column-2"><StateIcon factState={ fact.state }/></th>);

        for (let i = 0; i < systems.length; i += 1) {
            let system = fact.systems.find(function(system) {
                return system.id === systems[i].id;
            });
            tr.push(
                <td className={ fact.state === 'DIFFERENT' ? 'highlight' : '' }>
                    { system.value === null ? 'No Data' : system.value }
                </td>
            );
        }

        tr.push(<td className={ fact.state === 'DIFFERENT' ? 'highlight' : '' }></td>);

        return tr;
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
                        <ServerIcon className="cluster-icon-large"/>
                        <div className="system-name">{ systems[i].fqdn }</div>
                        <div>Last Sync { this.formatDate(systems[i].last_updated) }</div>
                    </div>
                </th>
            );
        }

        return row;
    }

    renderEmptyState() {
        return (
            <center>
                <EmptyState>
                    <EmptyStateIcon icon={ CubesIcon } />
                    <br></br>
                    <Title size="lg">Add Systems to Compare</Title>
                    <EmptyStateBody>
                        You currently have no Hosts displayed.
                        Please add two or more Hosts to
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
                <div className="drift-table-wrap">
                    <div className="drift-table-scroller">
                        <table className="pf-c-table ins-c-table pf-m-compact ins-entity-table drift-table">
                            <thead>
                                <tr>
                                    <th className="fact-header fixed-column-1">
                                        <div>Fact</div>
                                    </th>
                                    <th className="state-header fixed-column-2">
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
                </div>
                <TablePagination />
            </React.Fragment>
        );
    }

    render() {
        const { filteredCompareData, fullCompareData, systems, loading } = this.props;

        return (
            <React.Fragment>
                <AddSystemModal
                    selectedSystemIds={ systems.map(system => system.id) }
                    showModal={ this.props.addSystemModalOpened }
                    confirmModal={ this.fetchCompare }
                />
                { fullCompareData.length > 0 || loading ?
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
        systems: state.compareReducer.systems
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompare: ((systemIds) => dispatch(compareActions.fetchCompare(systemIds)))
    };
}

DriftTable.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    fetchCompare: PropTypes.func,
    fullCompareData: PropTypes.array,
    filteredCompareData: PropTypes.array,
    systems: PropTypes.array,
    addSystemModalOpened: PropTypes.bool,
    stateFilter: PropTypes.string,
    factFilter: PropTypes.string,
    loading: PropTypes.bool
};

export default withRouter (connect(mapStateToProps, mapDispatchToProps)(DriftTable));
