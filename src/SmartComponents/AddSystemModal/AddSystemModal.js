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
import DriftTooltip from '../DriftTooltip/DriftTooltip';
import { addSystemModalActions } from './redux';
import { baselinesTableActions } from '../BaselinesTable/redux';
import { historicProfilesActions } from '../HistoricalProfilesPopover/redux';
import systemsTableActions from '../SystemsTable/actions';
import { RegistryContext } from '../../Utilities/registry';

export class AddSystemModal extends Component {
    constructor(props) {
        super(props);
        this.confirmModal = this.confirmModal.bind(this);
        this.cancelSelection = this.cancelSelection.bind(this);
        this.changeActiveTab = this.changeActiveTab.bind(this);

        this.state = {
            systemColumns: this.buildSystemColumns(this.props.permissions),
            columns: [
                { title: 'Name', transforms: [ sortable ]},
                { title: 'Last updated', transforms: [ sortable, cellWidth(20) ]},
                { title: 'Associated systems', transforms: [ cellWidth(20) ]}
            ],
            basketIsVisible: false,
            previousSelectedBaselineIds: []
        };

        this.addSystemModal = React.createRef();
    }

    async componentDidMount() {

        if (this.props.middlewareListener) {
            window.entityListener = addNewListener(this.props.middlewareListener, {
                actionType: 'SELECT_ENTITY',
                callback: ({ data }) => {
                    this.props.addSystemModalOpened ? this.systemContentSelect(data) : null;
                }
            });
        }
    }

    closePopover = () => {
        const { disableSystemTable } = this.props;

        disableSystemTable(false);
        this.setState({ basketIsVisible: false });
    }

    buildSystemColumns(permissions) {
        return [
            { key: 'display_name', props: { width: 20 }, title: 'Name' },
            { key: 'tags', props: { width: 10, isStatic: true }, title: 'Tags' },
            { key: 'updated', props: { width: 10 }, title: 'Last seen' },
            ...permissions.hspRead ? [{ key: 'historical_profiles', props: { width: 10, isStatic: true }, title: 'Historical profiles' }] : []
        ];
    }

    createContent = (id, content, body, name) => {
        return {
            id,
            icon: <DriftTooltip
                content={ content }
                body={ body }
            />,
            name
        };
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.addSystemModalOpened && this.props.addSystemModalOpened) {
            this.setState({ previousSelectedBaselineIds: this.props.selectedBaselineIds });
        }
    }

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
                return this.createContent(item[0], 'Baseline', <BlueprintIcon />, item[1]);
            }.bind(this));
        } else {
            ids = [ baselineTableData[rowId][0] ];

            selectedContent.push(
                this.createContent(baselineTableData[rowId][0], 'Baseline', <BlueprintIcon />, baselineTableData[rowId][1])
            );
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

    findNotInComparison(basketContent, comparedContent) {
        if (comparedContent.length === 0) {
            return basketContent;
        } else {
            return basketContent.filter(basketItem => (
                comparedContent.findIndex(comparedItem => (basketItem.id === comparedItem.id)) === -1
            ));
        }
    }

    setSelectedContent() {
        const { baselines, handleBaselineSelection, handleHSPSelection, handleSystemSelection, historicalProfiles,
            selectBaseline, selectedBaselineContent, selectedHSPContent, selectedSystemContent, selectHistoricProfiles,
            systems } = this.props;

        handleSystemSelection(this.findNotInComparison(selectedSystemContent, systems), false);
        let baselinesToRemove = this.findNotInComparison(selectedBaselineContent, baselines);
        handleBaselineSelection(baselinesToRemove, false);
        baselinesToRemove.forEach(baseline => selectBaseline(baseline.id, false, 'COMPARISON'));
        let hspsToRemove = this.findNotInComparison(selectedHSPContent, historicalProfiles);
        hspsToRemove.forEach(hsp => handleHSPSelection(hsp));
        selectHistoricProfiles(historicalProfiles.map(hsp => hsp.id));
    }

    cancelSelection() {
        const { toggleAddSystemModal, setSelectedBaselines } = this.props;
        const { previousSelectedBaselineIds } = this.state;

        setSelectedBaselines(previousSelectedBaselineIds, 'COMPARISON');
        this.setSelectedContent();
        toggleAddSystemModal();
    }

    changeActiveTab(event, tabIndex) {
        const { selectActiveTab } = this.props;

        selectActiveTab(tabIndex);
    }

    bulkSelectBasket = (baselineTableData, isSelected) => {
        const { handleBaselineSelection } = this.props;
        let selectedContent = baselineTableData.map(function(baseline) {
            return this.createContent(baseline[0], 'Baseline', <BlueprintIcon />, baseline[1]);
        }.bind(this));

        handleBaselineSelection(selectedContent, isSelected);
    }

    systemContentSelect = (data) => {
        const { entities, handleSystemSelection, selectedSystemContent } = this.props;
        let selectedSystems = [];

        if (data.id === 0) {
            if (data.bulk) {
                selectedSystems = selectedSystemContent;
            } else {
                selectedSystems = entities.rows.map(function(row) {
                    return this.createContent(row.id, 'System', <ServerIcon />, row.display_name);
                }.bind(this));
            }
        } else {
            if (!data.selected) {
                selectedSystems = selectedSystemContent.filter(system => system.id === data.id);
            } else {
                entities.rows.forEach(function(row) {
                    if (row.id === data.id) {
                        selectedSystems.push({
                            id: row.id,
                            name: row.display_name,
                            icon: <DriftTooltip
                                content='System'
                                body={ <ServerIcon /> }
                            />
                        });
                    }
                });
            }
        }

        handleSystemSelection(selectedSystems, data.selected);
    };

    render() {
        const { activeTab, addSystemModalOpened, baselines, baselineTableData, emptyState, globalFilterState, handleBaselineSelection,
            handleHSPSelection, handleSystemSelection, historicalProfiles, loading, entities, permissions, selectEntity, selectHistoricProfiles,
            selectedBaselineIds, selectedBaselineContent, selectedHSPContent, selectedHSPIds, selectBaseline, selectedSystemContent,
            selectedSystemIds, setSelectedSystemIds, systems, totalBaselines, baselineError, revertBaselineFetch } = this.props;
        const { columns, basketIsVisible, systemColumns } = this.state;

        return (
            <React.Fragment>
                <Modal
                    className='drift'
                    ref={ this.addSystemModal }
                    onScroll={ basketIsVisible ? this.closePopover : null }
                    style={{ maxHeight: '600px' }}
                    width={ '1200px' }
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
                                    handleSystemSelection={ handleSystemSelection }
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
                                    systems={ systems }
                                    baselines={ baselines }
                                    historicalProfiles={ historicalProfiles }
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
                                historicalProfiles={ historicalProfiles }
                                hasMultiSelect={ true }
                                permissions={ permissions }
                                entities={ entities }
                                selectVariant='checkbox'
                                onSystemSelect={ setSelectedSystemIds }
                                systemColumns={ systemColumns }
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
                                bulkSelectBasket={ this.bulkSelectBasket }
                                selectedBaselineIds={ selectedBaselineIds }
                                totalBaselines={ totalBaselines }
                                permissions={ permissions }
                                kebab={ false }
                                basketIsVisible={ basketIsVisible }
                                leftAlignToolbar={ true }
                                hasSwitch={ false }
                                emptyState={ emptyState }
                                baselineError={ baselineError }
                                revertBaselineFetch={ revertBaselineFetch }
                                selectBaseline={ selectBaseline }
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
    permissions: PropTypes.object,
    globalFilterState: PropTypes.object,
    selectedSystemIds: PropTypes.array,
    setSelectedSystemIds: PropTypes.func,
    selectHistoricProfiles: PropTypes.func,
    selectedSystemContent: PropTypes.array,
    selectedBaselineContent: PropTypes.array,
    selectedHSPContent: PropTypes.array,
    handleSystemSelection: PropTypes.func,
    handleBaselineSelection: PropTypes.func,
    handleHSPSelection: PropTypes.func,
    selectEntity: PropTypes.func,
    disableSystemTable: PropTypes.func,
    setSelectedBaselines: PropTypes.func,
    updateReferenceId: PropTypes.func,
    emptyState: PropTypes.bool,
    baselineError: PropTypes.object,
    revertBaselineFetch: PropTypes.func,
    middlewareListener: PropTypes.object
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
        totalBaselines: state.baselinesTableState.comparisonTable.totalBaselines,
        globalFilterState: state.globalFilterState,
        selectedHSPContent: state.addSystemModalState.selectedHSPContent,
        selectedBaselineContent: state.addSystemModalState.selectedBaselineContent,
        selectedSystemContent: state.addSystemModalState.selectedSystemContent,
        emptyState: state.baselinesTableState.comparisonTable.emptyState,
        baselineError: state.baselinesTableState.comparisonTable.baselineError
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
        setSelectedBaselines: (ids, tableId) => dispatch(baselinesTableActions.setSelectedBaselines(ids, tableId)),
        revertBaselineFetch: () => dispatch(baselinesTableActions.revertBaselineFetch('COMPARISON'))
    };
}

const WrappedAddSystemModal = (props) => {
    return <RegistryContext.Consumer>
        {
            registryContextValue =>
                <AddSystemModal
                    { ...props }
                    middlewareListener={ registryContextValue?.middlewareListener } />
        }
    </RegistryContext.Consumer>;
};

export default connect(mapStateToProps, mapDispatchToProps)(WrappedAddSystemModal);
