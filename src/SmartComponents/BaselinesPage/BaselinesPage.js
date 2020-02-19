import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Card, CardBody } from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import { sortable } from '@patternfly/react-table';

import BaselinesTable from '../BaselinesTable/BaselinesTable';
import CreateBaselineButton from './CreateBaselineButton/CreateBaselineButton';
import CreateBaselineModal from './CreateBaselineModal/CreateBaselineModal';

import { baselinesTableActions } from '../BaselinesTable/redux';

export class BaselinesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Name', transforms: [ sortable ]},
                { title: 'Last updated', transforms: [ sortable ]},
                { title: '' }
            ]
        };
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
    }

    fetchBaseline = (baselineId) => {
        const { history } = this.props;

        history.push('baselines/' + baselineId);
    }

    onSelect = (event, isSelected, rowId) => {
        const { baselineTableData, selectBaseline } = this.props;
        let ids;

        if (rowId === -1) {
            ids = baselineTableData.map(function(item) {
                return item[0];
            });
        } else {
            ids = [ baselineTableData[rowId][0] ];
        }

        selectBaseline(ids, isSelected, 'CHECKBOX');
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
        const { baselineTableData, loading, createBaselineModalOpened } = this.props;
        const { columns } = this.state;

        return (
            <CardBody>
                <div>
                    <BaselinesTable
                        kebab={ true }
                        createButton={ true }
                        exportButton={ true }
                        onClick={ this.fetchBaseline }
                        hasMultiSelect={ true }
                        tableId='CHECKBOX'
                        onSelect={ this.onSelect }
                        tableData={ baselineTableData }
                        loading={ loading }
                        createBaselineModalOpened={ createBaselineModalOpened }
                        columns={ columns }
                    />
                </div>
            </CardBody>
        );
    }

    render() {
        const { emptyState, loading } = this.props;

        /*eslint-disable camelcase*/
        return (
            <React.Fragment>
                <CreateBaselineModal />
                <PageHeader>
                    <PageHeaderTitle title='Baselines'/>
                </PageHeader>
                <Main>
                    <Card className='pf-t-light pf-m-opaque-100'>
                        { (emptyState && !loading)
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
    loading: PropTypes.bool,
    fullBaselineListData: PropTypes.array,
    baselineTableData: PropTypes.array,
    emptyState: PropTypes.bool,
    createBaselineModalOpened: PropTypes.bool,
    selectBaseline: PropTypes.func,
    history: PropTypes.object
};

function mapStateToProps(state) {
    return {
        loading: state.baselinesTableState.checkboxTable.loading,
        fullBaselineListData: state.baselinesTableState.checkboxTable.fullBaselineListData,
        emptyState: state.baselinesTableState.checkboxTable.emptyState,
        baselineTableData: state.baselinesTableState.checkboxTable.baselineTableData,
        createBaselineModalOpened: state.createBaselineModalState.createBaselineModalOpened
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectBaseline: (id, isSelected, tableId) => dispatch(baselinesTableActions.selectBaseline(id, isSelected, tableId))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BaselinesPage));
