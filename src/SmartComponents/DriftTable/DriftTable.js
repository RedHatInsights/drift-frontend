import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { get } from 'axios';
import { DRIFT_API_ROOT } from '../../constants';
import './drift-table.scss';
import { Section, Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Button, Card, CardBody } from '@patternfly/react-core';
import { AddSystem } from './AddSystem';

class DriftTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: '',
            modalResponse: ''
        };
        this.getDriftResponse = this.getDriftResponse.bind(this);
        this.addSystemModal = this.addSystemModal.bind(this);
        this.getDriftResponse();
    }

    addSystemModal() {
        return window.insights.chrome.auth.getUser()
        .then(() => {
            get(DRIFT_API_ROOT.concat('/status'))
            .then(
                (result) => {
                    this.setState({
                        modalResponse: result.data.status
                    });
                });
        });
    }

    getDriftResponse() {
        return window.insights.chrome.auth.getUser()
        .then(() => {
            get(DRIFT_API_ROOT.concat('/compare'))
            .then(
                (result) => {
                    this.setState({
                        response: result.data
                    });
                })
            /*eslint-disable no-console*/
            .catch(err => console.error(err));
            /*eslint-enable no-console*/
        });
    }

    renderRow(data, addSystemData) {
        if (data.facts === undefined) {
            return [];
        }

        let rows = [];

        for (let i = 0; i < data.facts.length; i++) {
            rows.push(
                <tr>
                    <td>{ data.facts[i].name }</td>
                    <td>{ data.facts[i].status }</td>
                    <td>{ addSystemData }</td>
                </tr>
            );
        }

        return rows;
    }

    renderHeaderRow(data) {
        if (data === undefined) {
            return [];
        }

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
        const { response, modalResponse } = this.state;

        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='Drift Analysis'/>
                </PageHeader>
                <Main>
                    <Card className='pf-t-light  pf-m-opaque-100'>
                        <Section type='button-group'>
                            <Button
                                variant='primary'
                                onClick={ this.getDriftResponse }
                                style={ { position: 'absolute', right: 50, top: 220 } }>
                                Load
                            </Button>
                        </Section>

                        <CardBody>
                            <div>
                                <table className="pf-c-table ins-c-table pf-m-compact ins-entity-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>State</th>
                                            { this.renderHeaderRow(response.facts) }
                                            <th>
                                                <AddSystem
                                                    getAddSystemModal={ this.addSystemModal } />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.renderRow(response, modalResponse) }
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

export default withRouter(DriftTable);
