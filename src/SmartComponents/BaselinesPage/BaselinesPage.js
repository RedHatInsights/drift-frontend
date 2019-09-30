import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Card, CardBody, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { SimpleTableFilter } from '@redhat-cloud-services/frontend-components';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';

import BaselinesTable from '../BaselinesTable/BaselinesTable';
import CreateBaselineButton from './CreateBaselineButton/CreateBaselineButton';
import CreateBaseline from './CreateBaseline/CreateBaseline';
import BaselinesKebab from './BaselinesKebab/BaselinesKebab';
import EditBaseline from './EditBaseline/EditBaseline';
import { baselinesTableActions } from '../BaselinesTable/redux';

class BaselinesPage extends Component {
    constructor(props) {
        super(props);
        this.state = { search: false };
        this.handleSearch = this.handleSearch.bind(this);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
        const { fetchBaselines } = this.props;

        fetchBaselines();
    }

    handleSearch = debounce(function(search) {
        this.setState({ search: true });
        this.props.fetchBaselines(search);
    }, 250)

    renderToolbar() {
        return (
            <Toolbar className="drift-toolbar">
                <ToolbarGroup>
                    <ToolbarItem>
                        <SimpleTableFilter buttonTitle={ null }
                            onFilterChange={ this.handleSearch }
                            placeholder="Search by name"
                        />
                    </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarItem>
                        <CreateBaselineButton />
                    </ToolbarItem>
                    <ToolbarItem>
                        <BaselinesKebab exportType='baseline list'/>
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>
        );
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
                        Please create a baseline to use in your System Comparison analysis.
                    </EmptyStateBody>
                    <CreateBaselineButton />
                </EmptyState>
            </center>
        );
    }

    renderTable() {
        const { baselineListLoading } = this.props;

        return (
            <CardBody>
                { this.renderToolbar() }
                <div>
                    <BaselinesTable baselineListLoading={ baselineListLoading }/>
                </div>
            </CardBody>
        );
    }

    render() {
        const { creatingNewBaseline, baselineUUID, fullBaselineListData, baselineListLoading } = this.props;

        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='Baselines'/>
                </PageHeader>
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
                        { baselineUUID !== '' ?
                            <CardBody>
                                <div>
                                    <EditBaseline />
                                </div>
                            </CardBody>
                            : null
                        }
                        { (!creatingNewBaseline && baselineUUID === '')
                            ? (fullBaselineListData.length === 0 && baselineListLoading === false)
                                ? this.renderEmptyState() : this.renderTable()
                            : null
                        }
                    </Card>
                </Main>
            </React.Fragment>
        );
    }
}

BaselinesPage.propTypes = {
    baselineListLoading: PropTypes.bool,
    creatingNewBaseline: PropTypes.bool,
    baselineUUID: PropTypes.string,
    fullBaselineListData: PropTypes.array,
    fetchBaselines: PropTypes.func
};

function mapStateToProps(state) {
    return {
        baselineListLoading: state.baselinesTableState.baselineListLoading,
        creatingNewBaseline: state.baselinesPageState.creatingNewBaseline,
        baselineUUID: state.baselinesTableState.baselineUUID,
        fullBaselineListData: state.baselinesTableState.fullBaselineListData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBaselines: ((search) => dispatch(baselinesTableActions.fetchBaselines(search)))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BaselinesPage);
