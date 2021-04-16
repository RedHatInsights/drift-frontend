import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Tab, Tabs } from '@patternfly/react-core';
import { connect } from 'react-redux';
import { sortable, cellWidth } from '@patternfly/react-table';

import SystemsTable from '../SystemsTable/SystemsTable';
import BaselinesTable from '../BaselinesTable/BaselinesTable';
import GlobalFilterAlert from '../GlobalFilterAlert/GlobalFilterAlert';
import { addSystemModalActions } from './redux';
import { baselinesTableActions } from '../BaselinesTable/redux';
import { historicProfilesActions } from '../HistoricalProfilesPopover/redux';

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
            ]
        };
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
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
        const { baselineTableData, selectBaseline } = this.props;
        let ids = [];

        baselineTableData.forEach(function(baseline) {
            ids.push(baseline[0]);
        });

        selectBaseline(ids, isSelected, 'CHECKBOX');
    }

    render() {
        const { activeTab, addSystemModalOpened, baselineTableData, globalFilterState, hasBaselinesReadPermissions,
            hasBaselinesWritePermissions, hasInventoryReadPermissions, historicalProfiles, loading, entities, selectedBaselineIds,
            selectedHSPIds, selectedSystemIds, setSelectedSystemIds, totalBaselines } = this.props;
        const { columns } = this.state;

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
                            isDisabled={ selectedSystemIds?.length === 0 &&
                                selectedBaselineIds.length === 0 &&
                                selectedHSPIds.length === 0 }
                            ouiaId="add-to-comparison-submit-button"
                        >
                            Submit
                        </Button>,
                        <Button
                            key="cancel"
                            variant="link"
                            onClick={ this.cancelSelection }
                            ouiaId="add-to-comparison-cancel-button"
                        >
                            Cancel
                        </Button>
                    ] }
                >

                    <GlobalFilterAlert globalFilterState={ globalFilterState } />
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
                                hasHistoricalDropdown={ true }
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
                                tableId='CHECKBOX'
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
    globalFilterState: PropTypes.object,
    selectedSystemIds: PropTypes.array,
    setSelectedSystemIds: PropTypes.func,
    selectHistoricProfiles: PropTypes.func
};

function mapStateToProps(state) {
    return {
        addSystemModalOpened: state.addSystemModalState.addSystemModalOpened,
        systems: state.compareState.systems,
        activeTab: state.addSystemModalState.activeTab,
        entities: state.entities,
        selectedBaselineIds: state.baselinesTableState.checkboxTable.selectedBaselineIds,
        baselines: state.compareState.baselines,
        selectedHSPIds: state.historicProfilesState.selectedHSPIds,
        loading: state.baselinesTableState.checkboxTable.loading,
        baselineTableData: state.baselinesTableState.checkboxTable.baselineTableData,
        historicalProfiles: state.compareState.historicalProfiles,
        totalBaselines: state.baselinesTableState.checkboxTable.totalBaselines,
        globalFilterState: state.globalFilterState
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleAddSystemModal: () => dispatch(addSystemModalActions.toggleAddSystemModal()),
        selectActiveTab: (newActiveTab) => dispatch(addSystemModalActions.selectActiveTab(newActiveTab)),
        selectBaseline: (id, isSelected, tableId) => dispatch(baselinesTableActions.selectBaseline(id, isSelected, tableId)),
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds)),
        setSelectedSystemIds: (selectedSystemIds) => dispatch(addSystemModalActions.setSelectedSystemIds(selectedSystemIds))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSystemModal);
