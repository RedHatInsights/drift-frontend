import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import queryString from 'query-string';

import { AddSystem } from './AddSystem';
import AddSystemModal from '../../AddSystemModal/AddSystemModal';
import { TablePagination } from '../Pagination/Pagination';
import './drift-table.scss';
import { compareActions } from '../../modules';
import StateIcon from '../../StateIcon/StateIcon';
import { CubesIcon, ServerIcon } from '@patternfly/react-icons';

function RenderTable(state) {
    if (state.props.fullCompareData.facts) {
        return (
            <React.Fragment>
                <AddSystemModal
                    selectedSystemIds={ state.systemIds }
                    showModal={ state.props.addSystemModalOpened }
                    confirmModal={ state.fetchCompare }
                />
                <table className="pf-c-table ins-c-table pf-m-compact ins-entity-table drift-table">
                    <thead>
                        <tr>
                            <th className="fact-header">
                                <div>Fact</div>
                            </th>
                            <th className="state-header">
                                <div>State</div>
                            </th>
                            { state.renderHeaderRow(state.props.filteredCompareData) }
                            <th>
                                <AddSystem
                                    getAddSystemModal={ state.props.toggleAddSystemModal } />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { state.renderRow(state.props.filteredCompareData) }
                    </tbody>
                </table>
                <TablePagination />
            </React.Fragment>
        );
    }
    else {
        return (
            <center>
                <React.Fragment>
                    <AddSystemModal
                        showModal={ state.props.addSystemModalOpened }
                        confirmModal={ state.fetchCompare }
                    />
                    <EmptyState>
                        <EmptyStateIcon icon={ CubesIcon } />
                        <br></br>
                        <Title size="lg">Add Systems to Compare</Title>
                        <EmptyStateBody>
                            You currently have no Hosts displayed.
                            Please add two or more Hosts to
                            compare their facts.
                        </EmptyStateBody>
                        <AddSystem
                            getAddSystemModal={ state.props.toggleAddSystemModal } />
                    </EmptyState>
                </React.Fragment>
            </center>
        );
    }
}

class DriftTable extends Component {
    constructor(props) {
        super(props);
        this.systemIds = queryString.parse(this.props.location.search).system_ids;
        this.fetchCompare = this.fetchCompare.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderRowData = this.renderRowData.bind(this);
        this.renderHeaderRow = this.renderHeaderRow.bind(this);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
        if (this.systemIds) {
            this.fetchCompare(this.systemIds);
        }
    }

    formatDate(dateString) {
        let date = new Date(dateString);
        return date.toLocaleDateString();
    }

    fetchCompare(systemIds) {
        /*eslint-disable camelcase*/
        this.props.history.push({
            search: '?' + queryString.stringify({ system_ids: systemIds })
        });
        /*eslint-enable camelcase*/
        this.props.fetchCompare(systemIds);
    }

    renderRow(data) {
        if (data === undefined || data.facts === undefined) {
            return [];
        }

        let rows = [];
        let rowData = [];

        for (let i = 0; i < data.facts.length; i += 1) {
            rowData = this.renderRowData(data.facts[i], data.systems);
            rows.push(<tr>{ rowData }</tr>);
        }

        return rows;
    }

    renderRowData(fact, systems) {
        let td = [];

        td.push(<td>{ fact.name }</td>);
        td.push(<td className="fact-state"><StateIcon factState={ fact.state }/></td>);

        for (let i = 0; i < systems.length; i += 1) {
            let system = fact.systems.find(function(system) {
                return system.id === systems[i].id;
            });
            td.push(
                <td className={ fact.state === 'DIFFERENT' ? 'highlight' : '' }>
                    { system.value === null ? 'No Data' : system.value }
                </td>
            );
        }

        td.push(<td className={ fact.state === 'DIFFERENT' ? 'highlight' : '' }></td>);

        return td;
    }

    renderHeaderRow(data) {
        if (data === undefined || data.facts === undefined) {
            return [];
        }

        data = data.systems;

        let row = [];

        for (let i = 0; i < data.length; i++) {
            row.push(
                <th>
                    <div className="system-header">
                        <ServerIcon className="cluster-icon-large"/>
                        <div className="system-name">{ data[i].fqdn }</div>
                        <div>Updated { this.formatDate(data[i].last_updated) }</div>
                    </div>
                </th>
            );
        }

        return row;
    }

    render() {
        return (
            <React.Fragment>
                { <RenderTable { ...this } /> }
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
        factFilter: state.compareReducer.factFilter
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompare: ((systemIds) => dispatch(compareActions.fetchCompare(systemIds))),
        toggleAddSystemModal: (() => dispatch(compareActions.toggleAddSystemModal()))
    };
}

DriftTable.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    fetchCompare: PropTypes.func,
    fullCompareData: PropTypes.object,
    filteredCompareData: PropTypes.object,
    toggleAddSystemModal: PropTypes.func,
    addSystemModalOpened: PropTypes.bool,
    stateFilter: PropTypes.string,
    factFilter: PropTypes.string
};

export default withRouter (connect(mapStateToProps, mapDispatchToProps)(DriftTable));
