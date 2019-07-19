import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Card, CardBody, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';

import BaselinesTable from '../BaselinesTable/BaselinesTable';
import CreateBaseline from './CreateBaseline/CreateBaseline';
import { baselinesTableActions } from '../BaselinesTable/redux';

class BaselinesPage extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
    }

    render() {
        const { fetchBaselines } = this.props;

        fetchBaselines();

        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='Baselines'/>
                </PageHeader>
                <Main>
                    <Card className='pf-t-light pf-m-opaque-100'>
                        <CardBody>
                            <Toolbar className="drift-toolbar">
                                <ToolbarGroup>
                                    <ToolbarItem>
                                        <CreateBaseline />
                                    </ToolbarItem>
                                </ToolbarGroup>
                            </Toolbar>
                            <div>
                                <BaselinesTable />
                            </div>
                        </CardBody>
                    </Card>
                </Main>
            </React.Fragment>
        );
    }
}

BaselinesPage.propTypes = {
    fetchBaselines: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        fetchBaselines: () => dispatch(baselinesTableActions.fetchBaselines())
    };
}

export default connect(null, mapDispatchToProps)(BaselinesPage);
