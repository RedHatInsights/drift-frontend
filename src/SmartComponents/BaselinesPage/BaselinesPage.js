import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Card, CardBody } from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';

import BaselinesTable from '../BaselinesTable/BaselinesTable';
import CreateBaselineButton from './CreateBaselineButton/CreateBaselineButton';
import CreateBaselineModal from './CreateBaselineModal/CreateBaselineModal';

export class BaselinesPage extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
    }

    renderEmptyState() {
        return (
            <center>
                <EmptyState>
                    <EmptyStateIcon icon={ AddCircleOIcon } />
                    <br></br>
                    <Title size="lg">No baselines</Title>
                    <EmptyStateBody>
                        You currently have no baselines displayed.
                        <br/>
                        Create a baseline to use in your System Comparison analysis.
                    </EmptyStateBody>
                    <CreateBaselineButton />
                </EmptyState>
            </center>
        );
    }

    renderTable() {
        return (
            <CardBody>
                <div>
                    <BaselinesTable kebab={ true } createButton={ true } exportButton={ true } hasSelect={ true }/>
                </div>
            </CardBody>
        );
    }

    render() {
        const { emptyState, baselineListLoading } = this.props;

        /*eslint-disable camelcase*/
        return (
            <React.Fragment>
                <CreateBaselineModal />
                <PageHeader>
                    <PageHeaderTitle title='Baselines'/>
                </PageHeader>
                <Main>
                    <Card className='pf-t-light pf-m-opaque-100'>
                        { (emptyState && baselineListLoading === false)
                            ? this.renderEmptyState() : this.renderTable()
                        }
                    </Card>
                </Main>
            </React.Fragment>
        );
        /*eslint-enable camelcase*/
    }
}

BaselinesPage.propTypes = {
    baselineListLoading: PropTypes.bool,
    fullBaselineListData: PropTypes.array,
    emptyState: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        baselineListLoading: state.baselinesTableState.baselineListLoading,
        fullBaselineListData: state.baselinesTableState.fullBaselineListData,
        emptyState: state.baselinesTableState.emptyState
    };
}

export default connect(mapStateToProps, null)(BaselinesPage);
