import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Card, CardBody } from '@patternfly/react-core';

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

        for (let i = 0; i < data.facts.length; i += 1) {
            const rowData = this.renderRowData(data.facts[i], data.metadata);
            rows.push(<tr>{ rowData }</tr>);
        }

        return rows;
    }

    renderRowData(facts, metadata) {
        let td = [];

        td.push(<td>{ facts.name }</td>);
        td.push(<td className="fact-state"><StateIcon factState={ facts.state }/></td>);

        for (let i = 0; i < metadata.length; i += 1) {
            let value = facts.systems[metadata[i].id];
            td.push(
                <td className={ facts.state === 'DIFFERENT' ? 'highlight' : '' }>{ value === null ? 'No Data' : value }</td>
            );
        }

        td.push(<td className={ facts.state === 'DIFFERENT' ? 'highlight' : '' }></td>);

        return td;
    }

    renderHeaderRow(data) {
        if (data === undefined || data.facts === undefined) {
            return [];
        }

        data = data.metadata;

        let row = [];

        for (let i = 0; i < data.length; i++) {
            row.push(
                <th>{ data[i].fqdn }</th>
            );
        }

        return row;
    }

    render() {
        const { compare, modalResponse } = this.props;

        return (
            <React.Fragment>
                <AddSystemModal
                    selectedSystemIds={ this.systemIds }
                    showModal={ this.props.addSystemModalOpened }
                    confirmModal={ this.fetchCompare }
                />
                <PageHeader>
                    <PageHeaderTitle title='System Comparison'/>
                </PageHeader>
                <Main className="drift">
                    <Card className='pf-t-light  pf-m-opaque-100'>
                        <CardBody>
                            <div>
                                <table className="pf-c-table ins-c-table pf-m-compact ins-entity-table">
                                    <thead>
                                        <tr>
                                            <th>Fact</th>
                                            <th>State</th>
                                            { this.renderHeaderRow(compare) }
                                            <th>
                                                <AddSystem
                                                    getAddSystemModal={ this.props.toggleAddSystemModalOpen } />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.renderRow(compare, modalResponse) }
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>

                </Main>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        compare: state.compareReducer.compare,
        modalResponse: state.statusReducer.status,
        addSystemModalOpened: state.statusReducer.addSystemModalOpened
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompare: ((systemIds) => dispatch(compareActions.fetchCompare(systemIds))),
        fetchStatus: (() => dispatch(compareActions.fetchStatus())),
        toggleAddSystemModalOpen: (() => dispatch(compareActions.toggleAddSystemModal()))
    };
}

DriftTable.propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    fetchCompare: PropTypes.func,
    fetchStatus: PropTypes.func,
    compare: PropTypes.object,
    modalResponse: PropTypes.object,
    toggleAddSystemModalOpen: PropTypes.func,
    addSystemModalOpened: PropTypes.bool
};

export default withRouter (connect(mapStateToProps, mapDispatchToProps)(DriftTable));
