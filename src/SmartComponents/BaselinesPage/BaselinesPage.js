import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { LockIcon } from '@patternfly/react-icons';
import { sortable, cellWidth } from '@patternfly/react-table';

import BaselinesTable from '../BaselinesTable/BaselinesTable';
import CreateBaselineModal from './CreateBaselineModal/CreateBaselineModal';
import EmptyStateDisplay from '../EmptyStateDisplay/EmptyStateDisplay';
import { addSystemModalActions } from '../AddSystemModal/redux';
import { baselinesTableActions } from '../BaselinesTable/redux';
import { editBaselineActions } from './EditBaselinePage/redux';
import { historicProfilesActions } from '../HistoricalProfilesPopover/redux';
import { PermissionContext } from '../../App';
import { RegistryContext } from '../../Utilities/registry';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

export class BaselinesPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columns: [
                { title: 'Name', transforms: [ sortable, cellWidth(45) ]},
                { title: 'Last updated', transforms: [ sortable, cellWidth(30) ]},
                { title: 'Associated systems', transforms: [ cellWidth(20) ]},
                { title: '', transforms: [ cellWidth(5) ]}
            ],
            error: {}
        };
    }

    async componentDidMount() {
        const chrome = this.props.chrome;
        await chrome?.appAction('baseline-list');
    }

    componentDidUpdate(prevProps) {
        const { baselineError, notificationsSwitchError } = this.props;

        if (prevProps.baselineError !== baselineError) {
            this.setState({ error: baselineError });
        }

        if (prevProps.notificationsSwitchError !== notificationsSwitchError) {
            this.setState({ error: notificationsSwitchError });
        }
    }

    fetchBaseline = (baselineId) => {
        const { navigate } = this.props;

        navigate('/baselines/' + baselineId);
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

    renderTable(permissions) {
        const { baselineError, baselineTableData, clearEditBaselineData, emptyState, exportStatus, loading, notificationsSwitchError,
            resetBaselinesExportStatus, revertBaselineFetch, selectBaseline, selectedBaselineIds, totalBaselines } = this.props;
        const { columns, error } = this.state;

        clearEditBaselineData();

        return (
            <div>
                <BaselinesTable
                    tableId='CHECKBOX'
                    hasMultiSelect={ true }
                    onSelect={ this.onSelect }
                    tableData={ baselineTableData }
                    loading={ loading }
                    columns={ columns }
                    kebab={ true }
                    createButton={ true }
                    exportButton={ true }
                    exportStatus={ exportStatus }
                    onClick={ this.fetchBaseline }
                    selectBaseline={ selectBaseline }
                    selectedBaselineIds={ selectedBaselineIds }
                    totalBaselines={ totalBaselines }
                    permissions={ permissions }
                    hasSwitch={ true }
                    notificationsSwitchError={ notificationsSwitchError }
                    emptyState={ emptyState }
                    revertBaselineFetch={ revertBaselineFetch }
                    baselineError={ baselineError }
                    error={ error }
                    resetBaselinesExportStatus={ resetBaselinesExportStatus }
                />
            </div>
        );
    }

    render() {
        const { selectHistoricProfiles, setSelectedSystemIds } = this.props;

        return (
            <PermissionContext.Consumer>
                { value =>
                    <RegistryContext.Consumer>
                        { registryContextValue =>
                            <React.Fragment>
                                <CreateBaselineModal
                                    permissions={ value.permissions }
                                    selectHistoricProfiles={ selectHistoricProfiles }
                                    setSelectedSystemIds={ setSelectedSystemIds }
                                    middlewareListener={ registryContextValue?.middlewareListener }
                                />
                                <PageHeader>
                                    <PageHeaderTitle title='Baselines'/>
                                </PageHeader>

                                <Main store={ registryContextValue?.registry?.getStore() }>
                                    { value.permissions.baselinesRead === false
                                        ? <EmptyStateDisplay
                                            icon={ LockIcon }
                                            color='#6a6e73'
                                            title={ 'You do not have access to Baselines' }
                                            text={ [ 'Contact your organization administrator(s) for more information.' ] }
                                        />
                                        : <React.Fragment>
                                            {this.renderTable(value.permissions)}
                                        </React.Fragment>
                                    }
                                </Main> </React.Fragment>
                        }
                    </RegistryContext.Consumer>

                }
            </PermissionContext.Consumer>
        );
    }
}

BaselinesPage.propTypes = {
    loading: PropTypes.bool,
    baselineTableData: PropTypes.array,
    emptyState: PropTypes.bool,
    exportStatus: PropTypes.string,
    selectBaseline: PropTypes.func,
    baselineError: PropTypes.object,
    revertBaselineFetch: PropTypes.func,
    clearEditBaselineData: PropTypes.func,
    selectedBaselineIds: PropTypes.array,
    totalBaselines: PropTypes.number,
    selectHistoricProfiles: PropTypes.func,
    setSelectedSystemIds: PropTypes.func,
    entitiesLoading: PropTypes.func,
    notificationsSwitchError: PropTypes.object,
    resetBaselinesExportStatus: PropTypes.func,
    chrome: PropTypes.object,
    navigate: PropTypes.func
};

function mapStateToProps(state) {
    return {
        loading: state.baselinesTableState.checkboxTable.loading,
        emptyState: state.baselinesTableState.checkboxTable.emptyState,
        exportStatus: state.baselinesTableState.checkboxTable.exportStatus,
        baselineTableData: state.baselinesTableState.checkboxTable.baselineTableData,
        baselineError: state.baselinesTableState.checkboxTable.baselineError,
        notificationsSwitchError: state.editBaselineState.notificationsSwitchError,
        selectedBaselineIds: state.baselinesTableState.checkboxTable.selectedBaselineIds,
        totalBaselines: state.baselinesTableState.checkboxTable.totalBaselines
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectBaseline: (id, isSelected, tableId) => dispatch(baselinesTableActions.selectBaseline(id, isSelected, tableId)),
        revertBaselineFetch: () => dispatch(baselinesTableActions.revertBaselineFetch('CHECKBOX')),
        clearEditBaselineData: () => dispatch(editBaselineActions.clearEditBaselineData()),
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds)),
        setSelectedSystemIds: (selectedSystemIds) => dispatch(addSystemModalActions.setSelectedSystemIds(selectedSystemIds)),
        resetBaselinesExportStatus: () => dispatch(baselinesTableActions.resetBaselinesExportStatus())
    };
}

const BaselinesPageWithHooks = props => {
    const chrome = useChrome();
    const navigate = useInsightsNavigate();
    return (
        <BaselinesPage { ...props } chrome={ chrome } navigate={ navigate } />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(BaselinesPageWithHooks);
