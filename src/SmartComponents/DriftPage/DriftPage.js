import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Card, CardBody, DropdownItem, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { errorAlertActions } from '../ErrorAlert/redux';
import { baselinesTableActions } from '../BaselinesTable/redux';
import { compareActions } from '../modules';
import { historicProfilesActions } from '../HistoricalProfilesDropdown/redux';
import { setHistory } from '../../Utilities/SetHistory';

import DriftTable from './DriftTable/DriftTable';
import FilterDropDown from './FilterDropDown/FilterDropDown';
import SearchBar from './SearchBar/SearchBar';
import ActionKebab from './ActionKebab/ActionKebab';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import TablePagination from '../Pagination/Pagination';
import ExportCSVButton from './ExportCSVButton/ExportCSVButton';
import DriftFilterChips from './DriftFilterChips/DriftFilterChips';
import AddSystemButton from './AddSystemButton/AddSystemButton';

export class DriftPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actionKebabItems: [
                <DropdownItem key="remove-systems" component="button" onClick={ this.clearComparison }>Clear all comparisons</DropdownItem>
            ],
            isEmpty: true
        };

        this.props.clearSelectedBaselines('CHECKBOX');
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
    }

    setIsEmpty = (isEmpty) => {
        this.setState({ isEmpty });
    }

    clearFilters = () => {
        const { clearComparisonFilters } = this.props;

        clearComparisonFilters();
    }

    clearComparison = () => {
        const { history, clearComparison, clearSelectedBaselines, selectHistoricProfiles, selectedHSPIds, updateReferenceId } = this.props;

        clearComparison();
        clearSelectedBaselines('CHECKBOX');
        selectHistoricProfiles(selectedHSPIds);
        updateReferenceId();
        setHistory(history, []);
    }

    render() {
        const { loading, emptyState, updatePagination, updateReferenceId, page, perPage, totalFacts } = this.props;
        const { actionKebabItems, isEmpty } = this.state;

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
                                                    <ActionKebab dropdownItems={ actionKebabItems } />
                                                </ToolbarItem>
                                            </ToolbarGroup>
                                            <ToolbarGroup className="pf-c-pagination">
                                                <ToolbarItem>
                                                    <TablePagination
                                                        page={ page }
                                                        perPage={ perPage }
                                                        total={ totalFacts }
                                                        isCompact={ true }
                                                        updatePagination={ updatePagination }
                                                    />
                                                </ToolbarItem>
                                            </ToolbarGroup>
                                        </Toolbar>
                                        <Toolbar className="drift-toolbar">
                                            <ToolbarGroup>
                                                <ToolbarItem>
                                                    <DriftFilterChips setIsEmpty={ this.setIsEmpty } />
                                                </ToolbarItem>
                                                { !isEmpty
                                                    ? <ToolbarItem>
                                                        <a onClick={ () => this.clearFilters() } >
                                                            Clear filters
                                                        </a>
                                                    </ToolbarItem>
                                                    : null
                                                }
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
                                                    page={ page }
                                                    perPage={ perPage }
                                                    total={ totalFacts }
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
    perPage: PropTypes.number,
    page: PropTypes.number,
    totalFacts: PropTypes.number,
    error: PropTypes.object,
    loading: PropTypes.bool,
    toggleErrorAlert: PropTypes.func,
    clearSelectedBaselines: PropTypes.func,
    emptyState: PropTypes.bool,
    updatePagination: PropTypes.func,
    updateReferenceId: PropTypes.func,
    clearComparison: PropTypes.func,
    clearComparisonFilters: PropTypes.func,
    history: PropTypes.object,
    selectHistoricProfiles: PropTypes.func,
    selectedHSPIds: PropTypes.array
};

function mapDispatchToProps(dispatch) {
    return {
        toggleErrorAlert: () => dispatch(errorAlertActions.toggleErrorAlert()),
        clearSelectedBaselines: (tableId) => dispatch(baselinesTableActions.clearSelectedBaselines(tableId)),
        updatePagination: (pagination) => dispatch(compareActions.updatePagination(pagination)),
        updateReferenceId: (id) => dispatch(compareActions.updateReferenceId(id)),
        clearComparison: () => dispatch(compareActions.clearComparison()),
        clearComparisonFilters: () => dispatch(compareActions.clearComparisonFilters()),
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds))
    };
}

function mapStateToProps(state) {
    return {
        page: state.compareState.page,
        perPage: state.compareState.perPage,
        totalFacts: state.compareState.totalFacts,
        error: state.compareState.error,
        loading: state.compareState.loading,
        emptyState: state.compareState.emptyState,
        selectedHSPIds: state.historicProfilesState.selectedHSPIds
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DriftPage));
