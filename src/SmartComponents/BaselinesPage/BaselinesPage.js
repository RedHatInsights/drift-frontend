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
import { baselinesTableActions } from '../BaselinesTable/redux';

export class BaselinesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpened: false
        };
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

    toggleModal = () => {
        const { modalOpened } = this.state;
        //const { fetchBaselines } = this.props;

        this.setState({ modalOpened: !modalOpened });
        if (modalOpened) {
            //fetchBaselines();
        }
    }

    renderTable() {
        return (
            <CardBody>
                <div>
                    <BaselinesTable kebab={ true } createButton={ true } exportButton={ true } hasSelect={ true } toggleModal={ this.toggleModal }/>
                </div>
            </CardBody>
        );
    }

    render() {
        const { emptyState, baselineListLoading } = this.props;
        const { modalOpened } = this.state;

        /*eslint-disable camelcase*/
        return (
            <React.Fragment>
                <CreateBaselineModal modalOpened={ modalOpened } toggleModal={ this.toggleModal }/>
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
    emptyState: PropTypes.bool,
    fetchBaselines: PropTypes.func
};

function mapStateToProps(state) {
    return {
        baselineListLoading: state.baselinesTableState.baselineListLoading,
        fullBaselineListData: state.baselinesTableState.fullBaselineListData,
        emptyState: state.baselinesTableState.emptyState
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBaselines: (params) => dispatch(baselinesTableActions.fetchBaselines(params))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BaselinesPage);
