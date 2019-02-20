import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { AddSystem } from './AddSystem';
import AddSystemModal from '../../AddSystemModal/AddSystemModal';
import './drift-table.scss';
import { compareActions } from '../../modules';
import StateIcon from '../../StateIcon/StateIcon';

class DriftTable extends Component {
    constructor(props) {
        super(props);
        this.systemIds = queryString.parse(this.props.location.search).system_ids;
        this.fetchCompare = this.fetchCompare.bind(this);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
        if (this.systemIds) {
            this.fetchCompare(this.systemIds);
        }
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
            if (data.facts[i].name.includes(this.props.factFilter)) {
                if (this.props.stateFilter === 'all' || this.props.stateFilter === undefined) {
                    rowData = this.renderRowData(data.facts[i], data.systems);
                    rows.push(<tr>{ rowData }</tr>);
                }
                else if (this.props.stateFilter === data.facts[i].state) {
                    rowData = this.renderRowData(data.facts[i], data.systems);
                    rows.push(<tr>{ rowData }</tr>);
                }
            }
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
                <th>{ data[i].fqdn }</th>
            );
        }

        return row;
    }

    render() {
        const { compare } = this.props;

        return (
            <React.Fragment>
                <AddSystemModal
                    selectedSystemIds={ this.systemIds }
                    showModal={ this.props.addSystemModalOpened }
                    confirmModal={ this.fetchCompare }
                />
                <table className="pf-c-table ins-c-table pf-m-compact ins-entity-table">
                    <thead>
                        <tr>
                            <th className="fact-header">Fact</th>
                            <th>State</th>
                            { this.renderHeaderRow(compare) }
                            <th>
                                <AddSystem
                                    getAddSystemModal={ this.props.toggleAddSystemModal } />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderRow(compare) }
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        compare: state.compareReducer.compare,
        addSystemModalOpened: state.addSystemModalReducer.addSystemModalOpened,
        stateFilter: state.filterByStateReducer.stateFilter,
        factFilter: state.filterByFactReducer.factFilter
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
    compare: PropTypes.object,
    toggleAddSystemModal: PropTypes.func,
    addSystemModalOpened: PropTypes.bool,
    stateFilter: PropTypes.string,
    factFilter: PropTypes.string
};

export default withRouter (connect(mapStateToProps, mapDispatchToProps)(DriftTable));
