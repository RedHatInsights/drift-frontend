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

class DriftTable extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
        this.hostIds = queryString.parse(this.props.location.search).host_ids;
        this.props.fetchCompare(this.hostIds);
    }

    renderRow(data, status) {
        if (data === undefined || data.facts === undefined) {
            return [];
        }

        let rows = [];

        for (let i = 0; i < data.facts.length; i++) {
            rows.push(
                <tr>
                    <td>{ data.facts[i].name }</td>
                    <td>{ data.facts[i].status }</td>
                    <td>{ status.status }</td>
                </tr>
            );
        }

        return rows;
    }

    renderHeaderRow(data) {
        if (data === undefined || data.facts === undefined) {
            return [];
        }

        data = data.facts;

        let row = [];
        let hostKeys = data[0].hosts.map(function(host) {
            return Object.keys(host);
        });
        let hostnames = hostKeys.flat();

        for (let i = 0; i < hostnames.length; i++) {
            row.push(
                <th>{ hostnames[i] }</th>
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
                                            <th>Name</th>
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
