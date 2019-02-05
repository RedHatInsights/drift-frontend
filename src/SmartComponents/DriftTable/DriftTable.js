import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Card, CardBody } from '@patternfly/react-core';

import { AddSystem } from './AddSystem';
import './drift-table.scss';
import { compareActions } from './modules';
import StateIcon from '../StateIcon/StateIcon';

class DriftTable extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
        this.hostIds = queryString.parse(this.props.location.search).host_ids;
        this.props.fetchCompare(this.hostIds);
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
        td.push(<td><StateIcon factState={ facts.state }/></td>);

        for (let i = 0; i < metadata.length; i += 1) {
            td.push(
                <td>{ facts.hosts[metadata[i].id] }</td>
            );
        }

        td.push(<td></td>);

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
                <PageHeader>
                    <PageHeaderTitle title='System Comparison'/>
                </PageHeader>
                <Main>
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
                                                    getAddSystemModal={ this.props.fetchStatus } />
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
        modalResponse: state.compareReducer.status
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompare: ((hostIds) => dispatch(compareActions.fetchCompare(hostIds))),
        fetchStatus: (() => dispatch(compareActions.fetchStatus()))
    };
}

DriftTable.propTypes = {
    fetchCompare: PropTypes.func,
    fetchStatus: PropTypes.func,
    compare: PropTypes.object,
    modalResponse: PropTypes.object,
    location: PropTypes.object
};

export default withRouter (connect(mapStateToProps, mapDispatchToProps)(DriftTable));
