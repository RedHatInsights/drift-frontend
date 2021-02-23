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

import _ from 'lodash';

export class EditBaselinePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpened: false,
            errorMessage: [ 'The baseline cannot be displayed at this time. Please retry and if',
                'the problem persists contact your system administrator.',
                ''
            ],
            loadingColumns: [
                { title: 'Fact', transforms: [ cellWidth(40) ]},
                { title: 'Value', transforms: [ cellWidth(45) ]},
                { title: '', transforms: [ cellWidth(5) ]}
            ],
            activeTab: 0
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

    componentDidUpdate() {
        if (this.props.baselineData) {
            document.title = this.props.baselineData.display_name + ' - Baselines - Drift | Red Hat Insights';
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

    renderBreadcrumb(baselineData, hasReadPermissions) {
        let breadcrumb;

        /*eslint-disable camelcase*/
        breadcrumb = <Breadcrumb ouiaId='edit-baseline-breadcrumb'>
            <BreadcrumbItem>
                <a onClick={ () => this.goToBaselinesList() }>
                    Baselines
                </a>
            </BreadcrumbItem>
            { baselineData && hasReadPermissions
                ? <BreadcrumbHeading>
                    { baselineData.display_name }
                </BreadcrumbHeading>
                : null
            }
        </Breadcrumb>;
        /*eslint-enable camelcase*/

        return breadcrumb;
    }

    renderPageTitle(baselineData, hasReadPermissions, hasWritePermissions) {
        let pageTitle;

        if (hasReadPermissions) {
            if (hasWritePermissions) {
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

    renderPageHeader = (hasReadPermissions, hasWritePermissions) => {
        const { modalOpened } = this.state;
        const { baselineData, baselineDataLoading, inlineError } = this.props;
        let pageHeader;

        if (baselineDataLoading) {
            pageHeader = <PageHeader>
                <div><Skeleton size={ SkeletonSize.lg } /></div>
            </PageHeader>;
        } else {
            if (baselineData !== undefined) {
                pageHeader = <React.Fragment>
                    <EditBaselineNameModal
                        baselineData={ baselineData }
                        modalOpened={ modalOpened }
                        toggleEditNameModal={ this.toggleEditNameModal }
                        error={ inlineError }
                    />
                    <PageHeader className='bottom-padding-0'>
                        { this.renderBreadcrumb(baselineData, hasReadPermissions) }
                        <div id="edit-baseline-title">
                            { this.renderPageTitle(baselineData, hasReadPermissions, hasWritePermissions) }
                        </div>
                        { this.renderTabs() }
                    </PageHeader>
                </React.Fragment>;
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
                    title="baseline"
                    id="baseline-tab"
                    data-ouia-component-id="baseline-tab-button"
                >
                </Tab>
                <Tab
                    eventKey={ 1 }
                    title="system notifications"
                    id="system-notifications-tab"
                    data-ouia-component-id=""
                >
                </Tab>
            </Tabs>
        </div>;
    }

    renderMain(baselinesWrite, inventoryRead) {
        const { baselineData, baselineDataLoading, clearErrorData, driftClearFilters, editBaselineEmptyState, editBaselineError,
            editBaselineTableData, entities, expandRow, expandedRows, exportToCSV, factModalOpened, selectFact,
            match: { params }, selectEntities, selectHistoricProfiles, setSelectedSystemIds, updateColumns } = this.props;
        const { activeTab } = this.state;
        let body;

        if (activeTab === 0) {
            body = <EditBaseline
                baselineData={ baselineData }
                baselineDataLoading={ baselineDataLoading }
                clearErrorData={ clearErrorData }
                editBaselineEmptyState={ editBaselineEmptyState }
                editBaselineError={ editBaselineError }
                editBaselineTableData={ editBaselineTableData }
                expandRow={ expandRow }
                expandedRows={ expandedRows }
                exportToCSV={ exportToCSV }
                factModalOpened={ factModalOpened }
                hasWritePermissions={ baselinesWrite }
                history={ history }
                selectFact={ selectFact }
            />;
        } else {
            body = <SystemNotification
                baselineId={ params.id }
                baselineName={ baselineData?.display_name }
                hasInventoryReadPermissions={ inventoryRead }
                entities={ entities }
                driftClearFilters={ driftClearFilters }
                selectEntities={ selectEntities }
                selectHistoricProfiles={ selectHistoricProfiles }
                setSelectedSystemIds={ setSelectedSystemIds }
                updateColumns={ updateColumns }
            />;
        }

        return body;
    }

    /*eslint-disable*/
    render() {
        return (
            <PermissionContext.Consumer>
                { value =>
                    <React.Fragment>
                        { this.renderPageHeader(value.permissions.baselinesRead, value.permissions.baselinesWrite) }
                        <Main>
                            { value.permissions.baselinesRead === false
                                ? <EmptyStateDisplay
                                    icon={ LockIcon }
                                    color='#6a6e73'
                                    title={ 'You do not have access to view this Baseline' }
                                    text={ [ 'Contact your organization administrator(s) for more information.' ] }
                                />
                                : this.renderMain(value.permissions.baselinesWrite, value.permissions.inventoryRead)
                            }
                        </Main>
                    </React.Fragment>
                }
            </PermissionContext.Consumer>
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
    expandedRows: PropTypes.array,
    selectFact: PropTypes.func,
    clearErrorData: PropTypes.func,
    editBaselineError: PropTypes.object,
    inlineError: PropTypes.object,
    editBaselineEmptyState: PropTypes.bool,
    exportToCSV: PropTypes.func,
    hasWritePermissions: PropTypes.bool,
    fetchBaselines: PropTypes.func,
    entities: PropTypes.object,
    selectHistoricProfiles: PropTypes.func,
    setSelectedSystemIds: PropTypes.func,
    driftClearFilters: PropTypes.func,
    updateColumns: PropTypes.func,
    selectEntities: PropTypes.func
};

function mapStateToProps(state) {
    return {
        baselineData: state.editBaselineState.baselineData,
        baselineDataLoading: state.editBaselineState.baselineDataLoading,
        factModalOpened: state.editBaselineState.factModalOpened,
        editBaselineTableData: state.editBaselineState.editBaselineTableData,
        expandedRows: state.editBaselineState.expandedRows,
        editBaselineError: state.editBaselineState.editBaselineError,
        editBaselineEmptyState: state.editBaselineState.editBaselineEmptyState,
        inlineError: state.editBaselineState.inlineError,
        entities: state.entities
    };
}

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
        fetchBaselines: (tableId, params) => dispatch(baselinesTableActions.fetchBaselines(tableId, params)),
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds)),
        setSelectedSystemIds: (systemIds) => dispatch(compareActions.setSelectedSystemIds(systemIds)),
        driftClearFilters: () => dispatch(systemsTableActions.clearAllFilters()),
        updateColumns: (key) => dispatch(systemsTableActions.updateColumns(key)),
        selectEntities: (toSelect) => dispatch({ type: 'SELECT_ENTITY', payload: toSelect })
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditBaselinePage));
