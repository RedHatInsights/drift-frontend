import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import PropTypes from 'prop-types';
import { Button, Modal, Tab, Tabs } from '@patternfly/react-core';
import { connect } from 'react-redux';
import { withCookies, Cookies } from 'react-cookie';
import { sortable } from '@patternfly/react-table';

import SystemsTable from '../SystemsTable/SystemsTable';
import BaselinesTable from '../BaselinesTable/BaselinesTable';
import { addSystemModalActions } from './redux';
import { baselinesTableActions } from '../BaselinesTable/redux';

export class AddSystemModal extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.confirmModal = this.confirmModal.bind(this);
        this.cancelSelection = this.cancelSelection.bind(this);
        this.changeActiveTab = this.changeActiveTab.bind(this);

        this.state = {
            columns: [
                { title: 'Name', transforms: [ sortable ]},
                { title: 'Last updated', transforms: [ sortable ]}
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
        const { confirmModal, entities, selectedBaselineIds, toggleModal, selectedHSPIds, referenceId } = this.props;

        confirmModal(
            entities.selectedSystemIds,
            selectedBaselineIds,
            selectedHSPIds,
            referenceId
        );
        toggleModal();
    }

    cancelSelection() {
        this.props.toggleModal();
    }

    selectedSystemIds() {
        let ids = this.props.systems.map(function (system) {
            return system.id;
        });

        return ids ? ids : [];
    }

    changeActiveTab(event, tabIndex) {
        const { selectActiveTab } = this.props;

        selectActiveTab(tabIndex);
    }

    render() {
        const { activeTab, addSystemModalOpened, baselineTableData, historicalProfiles, loading,
            entities, selectedBaselineIds, selectedHSPIds } = this.props;
        const { columns } = this.state;

        return (
            <React.Fragment>
                <Modal
                    className="add-system-modal"
                    title="Add to comparison"
                    isOpen={ addSystemModalOpened }
                    onClose={ this.cancelSelection }
                    isFooterLeftAligned
                    actions={ [
                        <Button
                            key="confirm"
                            variant="primary"
                            onClick={ this.confirmModal }
                            isDisabled={
                                (entities && entities.selectedSystemIds && entities.selectedSystemIds.length === 0) &&
                                selectedBaselineIds.length === 0 &&
                                selectedHSPIds.length === 0
                            }
                        >
                            Submit
                        </Button>
                    ] }
                >
                    <Tabs
                        activeKey={ activeTab }
                        onSelect={ this.changeActiveTab }
                    >
                        <Tab
                            eventKey={ 0 }
                            title="Systems"
                            id='systems-tab'
                        >
                            <SystemsTable
                                selectedSystemIds={ this.selectedSystemIds() }
                                hasHistoricalDropdown={ true }
                                historicalProfiles={ historicalProfiles }
                            />
                        </Tab>
                        <Tab
                            eventKey={ 1 }
                            title="Baselines"
                            id='baselines-tab'
                        >
                            <BaselinesTable
                                tableId='CHECKBOX'
                                hasMultiSelect={ true }
                                onSelect={ this.onSelect }
                                tableData={ baselineTableData }
                                loading={ loading }
                                columns={ columns }/>
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
    toggleModal: PropTypes.func,
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
    referenceId: PropTypes.string
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
        historicalProfiles: state.compareState.historicalProfiles
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleModal: () => dispatch(addSystemModalActions.toggleAddSystemModal()),
        selectActiveTab: (newActiveTab) => dispatch(addSystemModalActions.selectActiveTab(newActiveTab)),
        selectBaseline: (id, isSelected, tableId) => dispatch(baselinesTableActions.selectBaseline(id, isSelected, tableId))
    };
}

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(AddSystemModal));
