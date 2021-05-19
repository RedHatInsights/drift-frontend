import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Tab, Tabs, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { BlueprintIcon, ServerIcon } from '@patternfly/react-icons';
import { connect } from 'react-redux';
import { sortable, cellWidth } from '@patternfly/react-table';
import { addNewListener } from '../../store';

import SystemsTable from '../SystemsTable/SystemsTable';
import BaselinesTable from '../BaselinesTable/BaselinesTable';
import GlobalFilterAlert from '../GlobalFilterAlert/GlobalFilterAlert';
import SelectedBasket from './SelectedBasket/SelectedBasket';
import { addSystemModalActions } from './redux';
import { baselinesTableActions } from '../BaselinesTable/redux';
import { historicProfilesActions } from '../HistoricalProfilesPopover/redux';
import systemsTableActions from '../SystemsTable/actions';

export class AddSystemModal extends Component {
    constructor(props) {
        super(props);
        this.confirmModal = this.confirmModal.bind(this);
        this.cancelSelection = this.cancelSelection.bind(this);
        this.changeActiveTab = this.changeActiveTab.bind(this);

        this.state = {
            columns: [
                { title: 'Name', transforms: [ sortable ]},
                { title: 'Last updated', transforms: [ sortable, cellWidth(20) ]}
            ],
            basketIsVisible: false
        };
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
        this.props.updateColumns('display_name');

        window.entityListener = addNewListener({
            actionType: 'SELECT_ENTITY',
            callback: ({ data }) => {
                this.props.addSystemModalOpened ? this.systemContentSelect(data) : null;
            }
        });
    }

    /*eslint-disable camelcase*/
    componentDidUpdate() {
        const { baselines, handleBaselineSelection, handleHSPSelection, handleSystemSelection, historicalProfiles,
            selectedBaselineContent, selectedHSPContent, selectedSystemContent, systems } = this.props;
        let newSelectedSystems = [];
        let newSelectedBaselines = [];

        if ((baselines.length || historicalProfiles.length || systems.length)
            && (!selectedBaselineContent.length && !selectedHSPContent.length && !selectedSystemContent.length)) {
            newSelectedSystems = systems.map(function(system) {
                return { id: system.id, icon: <ServerIcon />, name: system.display_name };
            });

            handleSystemSelection(newSelectedSystems, true);

            newSelectedBaselines = baselines.map(function(baseline) {
                return { id: baseline.id, icon: <BlueprintIcon />, name: baseline.display_name };
            });

            handleBaselineSelection(newSelectedBaselines, true);

            historicalProfiles.forEach(function(hsp) {
                let content = {
                    system_name: hsp.display_name,
                    captured_date: hsp.updated,
                    id: hsp.id,
                    system_id: hsp.system_id
                };

                handleHSPSelection(content);
            });
        }
    }
    /*eslint-enable camelcase*/

    toggleBasketVisible = () => {
        const { basketIsVisible } = this.state;
        const { disableSystemTable } = this.props;

        disableSystemTable(!basketIsVisible);
        this.setState({ basketIsVisible: !basketIsVisible });
    }

    onSelect = (event, isSelected, rowId) => {
        const { baselineTableData, handleBaselineSelection, selectBaseline } = this.props;
        let ids;
        let selectedContent = [];

        if (rowId === -1) {
            ids = baselineTableData.map(function(item) {
                return item[0];
            });

            selectedContent = baselineTableData.map(function(item) {
                return { id: item[0], icon: <BlueprintIcon />, name: item[1] };
            });
        } else {
            ids = [ baselineTableData[rowId][0] ];

            selectedContent.push({
                id: baselineTableData[rowId][0], icon: <BlueprintIcon />, name: baselineTableData[rowId][1]
            });
        }

        selectBaseline(ids, isSelected, 'COMPARISON');
        handleBaselineSelection(selectedContent, isSelected);
    }

    confirmModal() {
        const { confirmModal, entities, selectedBaselineIds, toggleAddSystemModal, selectedHSPIds, referenceId } = this.props;

        confirmModal(
            entities.selectedSystemIds,
            selectedBaselineIds,
            selectedHSPIds,
            referenceId
        );
        toggleAddSystemModal();
    }

    cancelSelection() {
        const { toggleAddSystemModal } = this.props;

        toggleAddSystemModal();
    }

    changeActiveTab(event, tabIndex) {
        const { selectActiveTab } = this.props;

        selectActiveTab(tabIndex);
    }

    onBulkSelect = (isSelected) => {
        const { baselineTableData, handleBaselineSelection, selectBaseline } = this.props;
        let ids = [];
        let selectedContent = [];

        baselineTableData.forEach(function(baseline) {
            ids.push(baseline[0]);
        });

        selectedContent = baselineTableData.map(function(baseline) {
            return { id: baseline[0], icon: <BlueprintIcon />, name: baseline[1] };
        });

        selectBaseline(ids, isSelected, 'COMPARISON');
        handleBaselineSelection(selectedContent, isSelected);
    }

    systemContentSelect = (data) => {
        const { entities, handleSystemSelection } = this.props;
        let selectedSystems = [];

        if (data.id === 0) {
            selectedSystems = entities.rows.map(function(row) {
                return { id: row.id, name: row.display_name, icon: <ServerIcon /> };
            });
        } else {
            entities.rows.forEach(function(row) {
                if (row.id === data.id) {
                    selectedSystems.push({ id: row.id, name: row.display_name, icon: <ServerIcon /> });
                }
            });
        }

        handleSystemSelection(selectedSystems, data.selected);
    };

    render() {
        const { activeTab, addSystemModalOpened, baselineTableData, globalFilterState, handleBaselineSelection, handleHSPSelection,
            hasBaselinesReadPermissions, hasBaselinesWritePermissions, hasInventoryReadPermissions, hasHSPReadPermissions, historicalProfiles,
            loading, entities, selectEntity, selectHistoricProfiles, selectedBaselineIds, selectedBaselineContent, selectedHSPContent, selectedHSPIds,
            selectBaseline, selectedSystemContent, selectedSystemIds, setSelectedSystemIds, totalBaselines } = this.props;
        const { columns, basketIsVisible } = this.state;

        return (
            <React.Fragment>
                <Modal
                    className="drift"
                    width={ '950px' }
                    title="Add to comparison"
                    ouiaId='add-to-comparison-modal'
                    isOpen={ addSystemModalOpened }
                    onClose={ this.cancelSelection }
                    actions={ [
                        <Button
                            key="confirm"
                            variant="primary"
                            onClick={ this.confirmModal }
                            isDisabled={ (entities?.selectedSystemIds?.length === 0 &&
                                selectedBaselineIds.length === 0 &&
                                selectedHSPIds.length === 0)
                                || basketIsVisible }
                            ouiaId="add-to-comparison-submit-button"
                        >
                            Submit
                        </Button>,
                        <Button
                            key="cancel"
                            variant="link"
                            onClick={ this.cancelSelection }
                            isDisabled={ basketIsVisible }
                            ouiaId="add-to-comparison-cancel-button"
                        >
                            Cancel
                        </Button>
                    ] }
                >
                    <GlobalFilterAlert globalFilterState={ globalFilterState } />
                    <Toolbar style={{ padding: '0px' }}>
                        <ToolbarContent>
                            <ToolbarItem variant='pagination'>
                                <SelectedBasket
                                    entities={ entities }
                                    handleBaselineSelection={ handleBaselineSelection }
                                    handleHSPSelection={ handleHSPSelection }
                                    isVisible={ basketIsVisible }
                                    selectBaseline={ selectBaseline }
                                    selectedBaselineContent={ selectedBaselineContent }
                                    selectedHSPContent={ selectedHSPContent }
                                    selectedSystemContent={ selectedSystemContent }
                                    selectEntity={ selectEntity }
                                    selectHistoricProfiles={ selectHistoricProfiles }
                                    toggleBasketVisible={ this.toggleBasketVisible }
                                />
                            </ToolbarItem>
                        </ToolbarContent>
                    </Toolbar>
                    <Tabs
                        activeKey={ activeTab }
                        onSelect={ this.changeActiveTab }
                    >
                        <Tab
                            eventKey={ 0 }
                            title="Systems"
                            id='systems-tab'
                            data-ouia-component-id='systems-tab-button'
                        >
                            <SystemsTable
                                selectedSystemIds={ selectedSystemIds }
                                hasHistoricalDropdown={ hasHSPReadPermissions }
                                historicalProfiles={ historicalProfiles }
                                hasMultiSelect={ true }
                                hasInventoryReadPermissions={ hasInventoryReadPermissions }
                                entities={ entities }
                                selectVariant='checkbox'
                                onSystemSelect={ setSelectedSystemIds }
                            />
                        </Tab>
                        <Tab
                            eventKey={ 1 }
                            title="Baselines"
                            id='baselines-tab'
                            data-ouia-component-id='baselines-tab-button'
                        >
                            <BaselinesTable
                                tableId='COMPARISON'
                                hasMultiSelect={ true }
                                onSelect={ this.onSelect }
                                tableData={ baselineTableData }
                                loading={ loading }
                                columns={ columns }
                                onBulkSelect={ this.onBulkSelect }
                                selectedBaselineIds={ selectedBaselineIds }
                                totalBaselines={ totalBaselines }
                                hasReadPermissions={ hasBaselinesReadPermissions }
                                hasWritePermissions={ hasBaselinesWritePermissions }
                                kebab={ false }
                                basketIsVisible={ basketIsVisible }
                            />
                        </Tab>
                    </Tabs>
                </Modal>
            </React.Fragment>
        );
    }
}

AddSystemModal.propTypes = {
    showModal: PropTypes.bool,
    addSystemModalOpened: PropTypes.bool,
    activeTab: PropTypes.number,
    confirmModal: PropTypes.func,
    cancelSelection: PropTypes.func,
    toggleAddSystemModal: PropTypes.func,
    selectActiveTab: PropTypes.func,
    entities: PropTypes.object,
    systems: PropTypes.array,
    selectedBaselineIds: PropTypes.array,
    baselines: PropTypes.array,
    selectedHSPIds: PropTypes.array,
    loading: PropTypes.bool,
    baselineTableData: PropTypes.array,
    selectBaseline: PropTypes.func,
    historicalProfiles: PropTypes.array,
    referenceId: PropTypes.string,
    totalBaselines: PropTypes.number,
    hasInventoryReadPermissions: PropTypes.bool,
    hasBaselinesReadPermissions: PropTypes.bool,
    hasBaselinesWritePermissions: PropTypes.bool,
    hasHSPReadPermissions: PropTypes.bool,
    globalFilterState: PropTypes.object,
    selectedSystemIds: PropTypes.array,
    setSelectedSystemIds: PropTypes.func,
    selectHistoricProfiles: PropTypes.func,
    updateColumns: PropTypes.func,
    selectedSystemContent: PropTypes.array,
    selectedBaselineContent: PropTypes.array,
    selectedHSPContent: PropTypes.array,
    handleSystemSelection: PropTypes.func,
    handleBaselineSelection: PropTypes.func,
    handleHSPSelection: PropTypes.func,
    selectEntity: PropTypes.func,
    disableSystemTable: PropTypes.func
};

function mapStateToProps(state) {
    return {
        addSystemModalOpened: state.addSystemModalState.addSystemModalOpened,
        systems: state.compareState.systems,
        activeTab: state.addSystemModalState.activeTab,
        entities: state.entities,
        selectedBaselineIds: state.baselinesTableState.comparisonTable.selectedBaselineIds,
        baselines: state.compareState.baselines,
        selectedHSPIds: state.historicProfilesState.selectedHSPIds,
        loading: state.baselinesTableState.comparisonTable.loading,
        baselineTableData: state.baselinesTableState.comparisonTable.baselineTableData,
        historicalProfiles: state.compareState.historicalProfiles,
        totalBaselines: state.baselinesTableState.checkboxTable.totalBaselines,
        globalFilterState: state.globalFilterState,
        selectedHSPContent: state.addSystemModalState.selectedHSPContent,
        selectedBaselineContent: state.addSystemModalState.selectedBaselineContent,
        selectedSystemContent: state.addSystemModalState.selectedSystemContent
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleAddSystemModal: () => dispatch(addSystemModalActions.toggleAddSystemModal()),
        selectActiveTab: (newActiveTab) => dispatch(addSystemModalActions.selectActiveTab(newActiveTab)),
        handleSystemSelection: (content, isSelected) => dispatch(addSystemModalActions.handleSystemSelection(content, isSelected)),
        handleBaselineSelection: (content, isSelected) => dispatch(addSystemModalActions.handleBaselineSelection(content, isSelected)),
        handleHSPSelection: (content) => dispatch(addSystemModalActions.handleHSPSelection(content)),
        selectBaseline: (id, isSelected, tableId) => dispatch(baselinesTableActions.selectBaseline(id, isSelected, tableId)),
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds)),
        selectEntity: (id, isSelected) => dispatch({ type: 'SELECT_ENTITY', payload: { id, isSelected }}),
        setSelectedSystemIds: (selectedSystemIds) => dispatch(addSystemModalActions.setSelectedSystemIds(selectedSystemIds)),
        disableSystemTable: (isDisabled) => dispatch(systemsTableActions.disableSystemTable(isDisabled)),
        updateColumns: (key) => dispatch(systemsTableActions.updateColumns(key))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSystemModal);
