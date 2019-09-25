import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';

import BaselinesTable from '../BaselinesTable/BaselinesTable';
import CreateBaselineButton from './CreateBaselineButton/CreateBaselineButton';
import CreateBaseline from './CreateBaseline/CreateBaseline';
import BaselinesKebab from './BaselinesKebab/BaselinesKebab';
import EditBaseline from './EditBaseline/EditBaseline';
import { baselinesTableActions } from '../BaselinesTable/redux';

class BaselinesPage extends Component {
    constructor(props) {
        super(props);

        this.setBaselineId();
        this.renderBreadcrumb = this.renderBreadcrumb.bind(this);
        this.goToBaselinesList = this.goToBaselinesList.bind(this);
    }

    setBaselineId() {
        const { match: { params }} = this.props;

        this.baselineId = params.id;
    }

    goToBaselinesList() {
        const { history, clearBaselineData } = this.props;

        clearBaselineData();
        history.goBack();
    }

    renderBreadcrumb() {
        const { baselineData } = this.props;
        let breadcrumb;

        /*eslint-disable camelcase*/
        breadcrumb = <Breadcrumb>
            <BreadcrumbItem>
                <a onClick={ () => this.goToBaselinesList() }>
                    Baselines
                </a>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>{ baselineData.display_name }</BreadcrumbItem>
        </Breadcrumb>;
        /*eslint-enable camelcase*/

        return breadcrumb;
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
        const { fetchBaselineData } = this.props;

        if (this.baselineId) {
            fetchBaselineData(this.baselineId);
        }
    }

    render() {
        const { creatingNewBaseline, baselineData, fullBaselineListData } = this.props;

        /*eslint-disable camelcase*/
        return (
            <React.Fragment>
                { baselineData !== undefined
                    ? <PageHeader>
                        { this.renderBreadcrumb() }
                        <br></br>
                        <PageHeaderTitle title={ baselineData.display_name }/>
                    </PageHeader>
                    : <PageHeader>
                        <PageHeaderTitle title='Baselines'/>
                    </PageHeader>
                }
                <Main>
                    <Card className='pf-t-light pf-m-opaque-100'>
                        { creatingNewBaseline
                            ? <CardBody>
                                <div>
                                    <CreateBaseline />
                                </div>
                            </CardBody>
                            : null
                        }
                        { baselineData !== undefined ?
                            <CardBody>
                                <div>
                                    <EditBaseline />
                                </div>
                            </CardBody>
                            : null
                        }
                        { !creatingNewBaseline && baselineData === undefined
                            ? <CardBody>
                                { fullBaselineListData.length !== 0
                                    ? <Toolbar className="drift-toolbar">
                                        <ToolbarGroup>
                                            <ToolbarItem>
                                                <CreateBaselineButton />
                                            </ToolbarItem>
                                            <ToolbarItem>
                                                <BaselinesKebab exportType='baseline list'/>
                                            </ToolbarItem>
                                        </ToolbarGroup>
                                    </Toolbar>
                                    : null
                                }
                                <div>
                                    <BaselinesTable />
                                </div>
                            </CardBody>
                            : null
                        }
                    </Card>
                </Main>
            </React.Fragment>
        );
        /*eslint-enable camelcase*/
    }
}

BaselinesPage.propTypes = {
    history: PropTypes.obj,
    baselineDataLoading: PropTypes.bool,
    creatingNewBaseline: PropTypes.bool,
    baselineData: PropTypes.obj,
    fullBaselineListData: PropTypes.array,
    clearBaselineData: PropTypes.func,
    match: PropTypes.any,
    fetchBaselineData: PropTypes.func
};

function mapStateToProps(state) {
    return {
        creatingNewBaseline: state.baselinesPageState.creatingNewBaseline,
        baselineData: state.baselinesTableState.baselineData,
        fullBaselineListData: state.baselinesTableState.fullBaselineListData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        clearBaselineData: () => dispatch(baselinesTableActions.clearBaselineData()),
        fetchBaselineData: (baselineUUID) => dispatch(baselinesTableActions.fetchBaselineData(baselineUUID))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BaselinesPage));
