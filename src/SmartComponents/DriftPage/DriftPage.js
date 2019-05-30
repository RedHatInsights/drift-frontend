import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Card, CardBody, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { errorAlertActions } from '../ErrorAlert/redux';

import DriftTable from './DriftTable/DriftTable';
import FilterDropDown from './FilterDropDown/FilterDropDown';
import SearchBar from './SearchBar/SearchBar';
import ActionKebab from './ActionKebab/ActionKebab';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import TablePagination from './Pagination/Pagination';

class DriftPage extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
    }

    render() {
        const { systems, loading } = this.props;

        if (this.props.error.detail) {
            this.props.toggleErrorAlert();
        }

        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='System Comparison'/>
                </PageHeader>
                <Main>
                    <ErrorAlert />
                    <Card className='pf-t-light pf-m-opaque-100'>
                        <CardBody>
                            { systems.length > 0 && !loading ?
                                <Toolbar className="drift-toolbar">
                                    <ToolbarGroup>
                                        <ToolbarItem>
                                            <SearchBar />
                                        </ToolbarItem>
                                        <ToolbarItem>
                                            <FilterDropDown />
                                        </ToolbarItem>
                                        <ToolbarItem>
                                            <ActionKebab />
                                        </ToolbarItem>
                                    </ToolbarGroup>
                                    <ToolbarGroup className="pf-c-pagination">
                                        <ToolbarItem>
                                            <TablePagination />
                                        </ToolbarItem>
                                    </ToolbarGroup>
                                </Toolbar>
                                : null
                            }
                            <div>
                                <DriftTable />
                            </div>
                        </CardBody>
                        { systems.length > 0 && !loading ?
                            <Toolbar className="drift-toolbar">
                                <ToolbarGroup className="pf-c-pagination">
                                    <ToolbarItem>
                                        <TablePagination />
                                    </ToolbarItem>
                                </ToolbarGroup>
                            </Toolbar>
                            : null
                        }
                    </Card>
                </Main>
            </React.Fragment>
        );
    }
}

DriftPage.propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool,
    systems: PropTypes.array,
    toggleErrorAlert: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        toggleErrorAlert: () => dispatch(errorAlertActions.toggleErrorAlert())
    };
}

function mapStateToProps(state) {
    return {
        error: state.compareState.error,
        loading: state.compareState.loading,
        systems: state.compareState.systems
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DriftPage));
