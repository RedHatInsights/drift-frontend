import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { get } from 'axios';
import { DRIFT_API_ROOT } from '../../constants';
import './sample-page.scss';

import { Section, Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Card, CardBody } from '@patternfly/react-core';

import { Button } from '@patternfly/react-core';

class SamplePage extends Component {
    constructor(props) {
        super(props);
        this.state = { response: '' };
        this.getDriftResponse = this.getDriftResponse.bind(this);
        this.getDriftResponse();
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

    renderRow(data) {
        if (data.facts === undefined) {
            return [];
        }

        let rows = [];

        for (let i = 0; i < data.facts.length; i++) {
            rows.push(
                <tr>
                    <td>{ data.facts[i].name }</td>
                    <td>{ data.facts[i].status }</td>
                </tr>
            );
        }

        return rows;
    }

    /*eslint-enable*/
    render() {
        const { response } = this.state;

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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.renderRow(response) }
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

export default withRouter(SamplePage);
