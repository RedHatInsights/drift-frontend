import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Card, CardBody, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { errorAlertActions } from '../ErrorAlert/redux';
import { baselinesTableActions } from '../BaselinesTable/redux';
import { compareActions } from '../modules';

import DriftTable from './DriftTable/DriftTable';
import FilterDropDown from './FilterDropDown/FilterDropDown';
import SearchBar from './SearchBar/SearchBar';
import ActionKebab from './ActionKebab/ActionKebab';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import TablePagination from './Pagination/Pagination';
import ExportCSVButton from './ExportCSVButton/ExportCSVButton';
import DriftFilterChips from './DriftFilterChips/DriftFilterChips';
import AddSystemButton from './AddSystemButton/AddSystemButton';

export class DriftPage extends Component {
    constructor(props) {
        super(props);

        this.props.clearSelectedBaselines('CHECKBOX');
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
    }

    render() {
        const { loading, emptyState, updatePagination, updateReferenceId } = this.props;

        if (this.props.error.detail) {
            this.props.toggleErrorAlert();
        }

        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='Comparison'/>
                </PageHeader>
                <Main>
                    <ErrorAlert />
                    <Card className='pf-t-light pf-m-opaque-100'>
                        <CardBody>
                            <div>
                                { !emptyState ?
                                    <React.Fragment>
                                        <Toolbar className="drift-toolbar">
                                            <ToolbarGroup>
                                                <ToolbarItem>
                                                    <SearchBar />
                                                </ToolbarItem>
                                                <ToolbarItem>
                                                    <FilterDropDown />
                                                </ToolbarItem>
                                                <ToolbarItem>
                                                    <AddSystemButton loading={ loading } />
                                                </ToolbarItem>
                                                <ToolbarItem>
                                                    <ExportCSVButton />
                                                </ToolbarItem>
                                                <ToolbarItem>
                                                    <ActionKebab
                                                        updateReferenceId={ updateReferenceId }
                                                    />
                                                </ToolbarItem>
                                            </ToolbarGroup>
                                            <ToolbarGroup className="pf-c-pagination">
                                                <ToolbarItem>
                                                    <TablePagination
                                                        isCompact={ true }
                                                        updatePagination={ updatePagination }
                                                    />
                                                </ToolbarItem>
                                            </ToolbarGroup>
                                        </Toolbar>
                                        <Toolbar className="drift-toolbar">
                                            <ToolbarGroup>
                                                <ToolbarItem>
                                                    <DriftFilterChips />
                                                </ToolbarItem>
                                            </ToolbarGroup>
                                        </Toolbar>
                                    </React.Fragment>
                                    : null
                                }
                                <DriftTable
                                    updateReferenceId={ updateReferenceId }
                                />
                                { !emptyState && !loading ?
                                    <Toolbar className="drift-toolbar">
                                        <ToolbarGroup className="pf-c-pagination">
                                            <ToolbarItem>
                                                <TablePagination
                                                    isCompact={ false }
                                                    updatePagination={ updatePagination }
                                                />
                                            </ToolbarItem>
                                        </ToolbarGroup>
                                    </Toolbar>
                                    : null
                                }
                            </div>
                        </CardBody>
                    </Card>
                </Main>
            </React.Fragment>
        );
    }
}

DriftPage.propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool,
    toggleErrorAlert: PropTypes.func,
    clearSelectedBaselines: PropTypes.func,
    emptyState: PropTypes.bool,
    updatePagination: PropTypes.func,
    updateReferenceId: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        toggleErrorAlert: () => dispatch(errorAlertActions.toggleErrorAlert()),
        clearSelectedBaselines: (tableId) => dispatch(baselinesTableActions.clearSelectedBaselines(tableId)),
        updatePagination: (pagination) => dispatch(compareActions.updatePagination(pagination)),
        updateReferenceId: (id) => dispatch(compareActions.updateReferenceId(id))
    };
}

function mapStateToProps(state) {
    return {
        error: state.compareState.error,
        loading: state.compareState.loading,
        emptyState: state.compareState.emptyState
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DriftPage));
