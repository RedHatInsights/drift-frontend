import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Breadcrumb, BreadcrumbItem, BreadcrumbHeading, Tab, Tabs } from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { EditAltIcon, LockIcon } from '@patternfly/react-icons';
import { cellWidth } from '@patternfly/react-table';

import EditBaselineNameModal from './EditBaselineNameModal/EditBaselineNameModal';
import EditBaseline from './EditBaseline/EditBaseline';
import SystemNotification from './SystemNotification/SystemNotification';
import { compareActions } from '../../modules';
import { baselinesTableActions } from '../../BaselinesTable/redux';
import { editBaselineActions } from './redux';
import systemsTableActions from '../../SystemsTable/actions';
import { historicProfilesActions } from '../../HistoricalProfilesPopover/redux';
import EmptyStateDisplay from '../../EmptyStateDisplay/EmptyStateDisplay';
import { PermissionContext } from '../../../App';
import NotificationDetails from '../../BaselinesTable/NotificationDetails/NotificationDetails';
import { RegistryContext } from '../../../Utilities/registry';

import _ from 'lodash';

export class EditBaselinePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpened: false,
            loadingColumns: [
                { title: 'Fact', transforms: [ cellWidth(40) ]},
                { title: 'Value', transforms: [ cellWidth(45) ]},
                { title: '', transforms: [ cellWidth(5) ]}
            ],
            activeTab: 0,
            error: {}
        };

        this.fetchBaselineId();
        this.renderBreadcrumb = this.renderBreadcrumb.bind(this);
        this.goToBaselinesList = this.goToBaselinesList.bind(this);

        this.toggleEditNameModal = () => {
            const { modalOpened } = this.state;
            const { clearErrorData } = this.props;

            this.setState({ modalOpened: !modalOpened });
            clearErrorData();
        };
    }

    async componentDidMount() {
        const { match: { params }} = this.props;

        await window.insights.chrome.auth.getUser();
        await window.insights?.chrome?.appAction?.('baseline-view');
        await window.insights?.chrome?.appObjectId(params.id);
    }

    componentDidUpdate(prevProps) {
        const { baselineData, editBaselineError, notificationsSwitchError } = this.props;

        if (baselineData) {
            document.title = this.props.baselineData.display_name + ' - Baselines - Drift | Red Hat Insights';
        }

        if (prevProps.editBaselineError !== editBaselineError) {
            this.setState({ error: editBaselineError });
        }

        if (prevProps.notificationsSwitchError !== notificationsSwitchError) {
            this.setState({ error: notificationsSwitchError });
        }
    }

    changeActiveTab = (event, tabIndex) => {
        this.setState({ activeTab: tabIndex });
    }

    async fetchBaselineId() {
        const { match: { params }, fetchBaselineData } = this.props;

        await fetchBaselineData(params.id);
    }

    goToBaselinesList() {
        const { clearBaselineData, fetchBaselines, history } = this.props;

        clearBaselineData('CHECKBOX');
        fetchBaselines('CHECKBOX');
        history.push('/baselines');
    }

    retryBaselineFetch = () => {
        const { clearErrorData } = this.props;

        clearErrorData();
        this.fetchBaselineId();
    }

    renderBreadcrumb(baselineData, baselinesRead) {
        let breadcrumb;

        /*eslint-disable camelcase*/
        breadcrumb = <Breadcrumb ouiaId='edit-baseline-breadcrumb'>
            <BreadcrumbItem>
                <a onClick={ () => this.goToBaselinesList() }>
                    Baselines
                </a>
            </BreadcrumbItem>
            { baselineData && baselinesRead
                ? <BreadcrumbHeading>
                    { baselineData.display_name }
                </BreadcrumbHeading>
                : null
            }
        </Breadcrumb>;
        /*eslint-enable camelcase*/

        return breadcrumb;
    }

    renderPageTitle(baselineData, baselinesRead, baselinesWrite) {
        let pageTitle;

        if (baselinesRead) {
            if (baselinesWrite) {
                pageTitle = <React.Fragment>
                    <span className='pf-c-title pf-m-2xl'>
                        { !_.isEmpty(baselineData) ? baselineData.display_name : null }
                    </span>
                    <span>
                        { <EditAltIcon
                            className='pointer not-active edit-icon-margin'
                            data-ouia-component-id='edit-baseline-name-button'
                            data-ouia-component-type='PF4/Button'
                            onClick={ () => this.toggleEditNameModal() } /> }
                    </span>
                </React.Fragment>;
            } else {
                pageTitle = <React.Fragment>{ !_.isEmpty(baselineData) ? baselineData.display_name : null }</React.Fragment>;
            }
        } else {
            pageTitle = <React.Fragment>{ 'Baseline' }</React.Fragment>;
        }

        return pageTitle;
    }

    renderPageHeader = ({ baselinesRead, baselinesWrite, notificationsRead }, store) => {
        const { modalOpened } = this.state;
        const { baselineData, baselineDataLoading, notificationsSwitchError, inlineError,
            toggleNotificationPending, toggleNotificationFulfilled, toggleNotificationRejected } = this.props;
        let pageHeader;

        if (baselineDataLoading) {
            pageHeader = <PageHeader>
                <div><Skeleton size={ SkeletonSize.lg } /></div>
            </PageHeader>;
        } else {
            if (baselineData !== undefined) {
                /*eslint-disable camelcase*/
                pageHeader = <React.Fragment>
                    <EditBaselineNameModal
                        baselineData={ baselineData }
                        modalOpened={ modalOpened }
                        toggleEditNameModal={ this.toggleEditNameModal }
                        error={ inlineError }
                        store={ store }
                    />
                    <PageHeader className={ notificationsRead ? 'bottom-padding-0' : '' }>
                        { this.renderBreadcrumb(baselineData, baselinesRead) }
                        <div id="edit-baseline-title">
                            { this.renderPageTitle(baselineData, baselinesRead, baselinesWrite) }
                            <NotificationDetails
                                classname='float-right'
                                hasBadge={ false }
                                hasLabel={ true }
                                hasSwitch={ true }
                                baselineData={{
                                    id: baselineData.id,
                                    display_name: baselineData.display_name,
                                    associated_systems: baselineData.mapped_system_count,
                                    notifications_enabled: baselineData.notifications_enabled
                                }}
                                notificationsSwitchError={ notificationsSwitchError }
                                toggleNotificationPending={ toggleNotificationPending }
                                toggleNotificationFulfilled={ toggleNotificationFulfilled }
                                toggleNotificationRejected={ toggleNotificationRejected }
                            />
                        </div>
                        { notificationsRead
                            ? this.renderTabs()
                            : null
                        }
                    </PageHeader>
                </React.Fragment>;
                /*eslint-enable camelcase*/
            } else {
                pageHeader = <PageHeader>
                    { this.renderBreadcrumb() }
                    <PageHeaderTitle title='Baseline' />
                </PageHeader>;
            }
        }

        return pageHeader;
    }

    renderTabs() {
        const { activeTab } = this.state;

        return <div>
            <Tabs
                activeKey={ activeTab }
                onSelect={ this.changeActiveTab }
            >
                <Tab
                    eventKey={ 0 }
                    title="Facts"
                    id="baseline-tab"
                    data-ouia-component-id="baseline-tab-button"
                >
                </Tab>
                <Tab
                    eventKey={ 1 }
                    title="Associated systems"
                    id="system-notifications-tab"
                    data-ouia-component-id=""
                >
                </Tab>
            </Tabs>
        </div>;
    }

    renderMain(permissions) {
        const { baselineData, baselineDataLoading, clearErrorData, driftClearFilters, editBaselineEmptyState, editBaselineError,
            editBaselineTableData, entities, expandRow, expandedRows, exportStatus, exportToCSV, exportToJSON, factModalOpened, fetchBaselineData,
            resetBaselineDataExportStatus, selectFact, match: { params }, selectEntities, selectHistoricProfiles, setSelectedSystemIds,
            toggleNameSort, toggleValueSort, nameSort, valueSort } = this.props;
        const { activeTab } = this.state;
        let body;

        if (activeTab === 0) {
            body = <EditBaseline
                baselineData={ baselineData }
                baselineDataLoading={ baselineDataLoading }
                clearErrorData={ clearErrorData }
                editBaselineEmptyState={ editBaselineEmptyState }
                editBaselineError={ editBaselineError }
                notificationsSwitchError
                editBaselineTableData={ editBaselineTableData }
                expandRow={ expandRow }
                expandedRows={ expandedRows }
                exportStatus={ exportStatus }
                exportToCSV={ exportToCSV }
                exportToJSON={ exportToJSON }
                factModalOpened={ factModalOpened }
                permissions={ permissions }
                history={ history }
                selectFact={ selectFact }
                toggleNameSort={ toggleNameSort }
                toggleValueSort= { toggleValueSort }
                nameSort= { nameSort }
                valueSort= { valueSort }
                resetBaselineDataExportStatus={ resetBaselineDataExportStatus }
            />;
        } else {
            body = <SystemNotification
                baselineId={ params.id }
                baselineName={ baselineData?.display_name }
                permissions={ permissions }
                entities={ entities }
                driftClearFilters={ driftClearFilters }
                fetchBaselineData={ fetchBaselineData }
                selectEntities={ selectEntities }
                selectHistoricProfiles={ selectHistoricProfiles }
                setSelectedSystemIds={ setSelectedSystemIds }
            />;
        }

        return body;
    }

    /*eslint-disable*/
    render() {
        return (
            <RegistryContext.Consumer>
            {
                registryContextValue =>
                <PermissionContext.Consumer>
                    { value =>
                        <React.Fragment>
                            { this.renderPageHeader(value.permissions, registryContextValue?.registry.getStore()) }
                            <Main store={ registryContextValue?.registry.getStore() }>
                                { value.permissions.baselinesRead === false
                                    ? <EmptyStateDisplay
                                        icon={ LockIcon }
                                        color='#6a6e73'
                                        title={ 'You do not have access to view this Baseline' }
                                        text={ [ 'Contact your organization administrator(s) for more information.' ] }
                                    />
                                    : this.renderMain(value.permissions)
                                }
                            </Main>
                        </React.Fragment>
                    }
                </PermissionContext.Consumer>
            }
            </RegistryContext.Consumer>
        );
    }
}
/*eslint-enable*/

EditBaselinePage.propTypes = {
    history: PropTypes.object,
    match: PropTypes.any,
    clearBaselineData: PropTypes.func,
    baselineData: PropTypes.object,
    baselineDataLoading: PropTypes.bool,
    fetchBaselineData: PropTypes.func,
    factModalOpened: PropTypes.bool,
    editBaselineTableData: PropTypes.array,
    expandRow: PropTypes.func,
    exportStatus: PropTypes.string,
    expandedRows: PropTypes.array,
    selectFact: PropTypes.func,
    clearErrorData: PropTypes.func,
    editBaselineError: PropTypes.object,
    notificationsSwitchError: PropTypes.object,
    inlineError: PropTypes.object,
    editBaselineEmptyState: PropTypes.bool,
    exportToCSV: PropTypes.func,
    exportToJSON: PropTypes.func,
    fetchBaselines: PropTypes.func,
    entities: PropTypes.object,
    selectHistoricProfiles: PropTypes.func,
    setSelectedSystemIds: PropTypes.func,
    driftClearFilters: PropTypes.func,
    selectEntities: PropTypes.func,
    toggleNotificationPending: PropTypes.func,
    toggleNotificationFulfilled: PropTypes.func,
    toggleNotificationRejected: PropTypes.func,
    toggleNameSort: PropTypes.func,
    toggleValueSort: PropTypes.func,
    nameSort: PropTypes.string,
    valueSort: PropTypes.string,
    resetBaselineDataExportStatus: PropTypes.func
};

function mapStateToProps(state) {
    return {
        baselineData: state.editBaselineState.baselineData,
        baselineDataLoading: state.editBaselineState.baselineDataLoading,
        factModalOpened: state.editBaselineState.factModalOpened,
        editBaselineTableData: state.editBaselineState.editBaselineTableData,
        expandedRows: state.editBaselineState.expandedRows,
        exportStatus: state.editBaselineState.exportStatus,
        editBaselineError: state.editBaselineState.editBaselineError,
        notificationsSwitchError: state.editBaselineState.notificationsSwitchError,
        editBaselineEmptyState: state.editBaselineState.editBaselineEmptyState,
        inlineError: state.editBaselineState.inlineError,
        nameSort: state.editBaselineState.nameSort,
        valueSort: state.editBaselineState.valueSort,
        entities: state.entities
    };
}

/*eslint-disable camelcase*/
function mapDispatchToProps(dispatch) {
    return {
        clearBaselineData: (tableId) => dispatch(baselinesTableActions.clearBaselineData(tableId)),
        expandRow: (factName) => dispatch(editBaselineActions.expandRow(factName)),
        fetchBaselineData: (baselineUUID) => dispatch(editBaselineActions.fetchBaselineData(baselineUUID)),
        selectFact: (facts, isSelected) => dispatch(editBaselineActions.selectFact(facts, isSelected)),
        clearErrorData: () => dispatch(editBaselineActions.clearErrorData()),
        exportToCSV: (exportData, baselineRowData)=> {
            dispatch(editBaselineActions.exportToCSV(exportData, baselineRowData));
        },
        exportToJSON: (exportData)=> {
            dispatch(editBaselineActions.exportToJSON(exportData));
        },
        fetchBaselines: (tableId, params) => dispatch(baselinesTableActions.fetchBaselines(tableId, params)),
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds)),
        setSelectedSystemIds: (systemIds) => dispatch(compareActions.setSelectedSystemIds(systemIds)),
        driftClearFilters: () => dispatch(systemsTableActions.clearAllFilters()),
        selectEntities: (toSelect) => dispatch({ type: 'SELECT_ENTITY', payload: toSelect }),
        toggleNotificationPending: () => dispatch(editBaselineActions.toggleNotificationPending()),
        toggleNotificationFulfilled: (data) => dispatch(editBaselineActions.toggleNotificationFulfilled(data)),
        toggleNotificationRejected: (error, id, display_name) => {
            dispatch(editBaselineActions.toggleNotificationRejected(error, id, display_name));
        },
        toggleNameSort: (sortType) => dispatch(editBaselineActions.toggleNameSort(sortType)),
        toggleValueSort: (sortType) => dispatch(editBaselineActions.toggleValueSort(sortType)),
        resetBaselineDataExportStatus: () => dispatch(editBaselineActions.resetBaselineDataExportStatus())
    };
}
/*eslint-enable camelcase*/

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditBaselinePage));
