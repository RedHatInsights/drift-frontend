import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { get } from 'axios';
import { DRIFT_API_ROOT } from '../../constants';
import './sample-page.scss';

import { Section, Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Card, CardBody } from '@patternfly/react-core';

import { Button } from '@patternfly/react-core';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
class SamplePage extends Component {
    constructor(props) {
        super(props);
        this.state = { response: '' };
        this.getDriftResponse = this.getDriftResponse.bind(this);
    }

    getDriftResponse() {
        get(DRIFT_API_ROOT.concat('/compare'))
        /*eslint-disable*/
        .then(
          (result) => {
            this.setState({
              response: result.data
            })
          })
	.catch(err => console.error(err));
    }
    /*eslint-enable*/
    render() {
        const { response } = this.state;
        const parsedResponse = JSON.stringify(response);

        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='Drift Analysis'/>
                </PageHeader>
                <Main>
                    <Card className='pf-t-light  pf-m-opaque-100'>
                        <Section type='button-group'>
                            <Button variant='primary' onClick={ this.getDriftResponse }> Export </Button>
                        </Section>

                        <CardBody>
                            <div>
                                <p>{ parsedResponse }</p>
                            </div>
                        </CardBody>
                    </Card>
                </Main>
            </React.Fragment>
        );
    }
}

export default withRouter(SamplePage);
