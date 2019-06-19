import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Tab, Tabs } from '@patternfly/react-core';
import { connect } from 'react-redux';

import SystemsTable from '../SystemsTable/SystemsTable';
import BaselinesTable from '../BaselinesTable/BaselinesTable';
import { compareActions } from '../modules';
import { addSystemModalActions } from './redux';
import { baselinesTableActions } from '../BaselinesTable/redux';

class AddSystemModal extends Component {
    constructor(props) {
        super(props);
        this.confirmModal = this.confirmModal.bind(this);
        this.cancelSelection = this.cancelSelection.bind(this);
        this.changeActiveTab = this.changeActiveTab.bind(this);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
    }

    confirmModal() {
        this.props.confirmModal(this.props.entities.selectedSystemIds);
        this.props.toggleModal();
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
        const { selectActiveTab, fetchBaselines } = this.props;

        selectActiveTab(tabIndex);
        if (tabIndex === 1) {
            fetchBaselines();
        }
    }

    render() {
        const { activeTab, addSystemModalOpened } = this.props;

        return (
            <React.Fragment>
                <Modal
                    title="Choose systems"
                    isOpen={ addSystemModalOpened }
                    onClose={ this.cancelSelection }
                    width="auto"
                    actions={ [
                        <Button
                            key="confirm"
                            variant="primary"
                            onClick={ this.confirmModal }>
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
                        >
                            <SystemsTable selectedSystemIds={ this.selectedSystemIds() }/>
                        </Tab>
                        <Tab
                            eventKey={ 1 }
                            title="Baselines"
                        >
                            <BaselinesTable />
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
    setSelectedSystemIds: PropTypes.func,
    cancelSelection: PropTypes.func,
    toggleModal: PropTypes.func,
    selectActiveTab: PropTypes.func,
    entities: PropTypes.object,
    systems: PropTypes.array,
    fetchBaselines: PropTypes.func
};

function mapStateToProps(state) {
    return {
        addSystemModalOpened: state.addSystemModalState.addSystemModalOpened,
        systems: state.compareState.systems,
        activeTab: state.addSystemModalState.activeTab,
        entities: state.entities
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleModal: () => dispatch(addSystemModalActions.toggleAddSystemModal()),
        selectActiveTab: (newActiveTab) => dispatch(addSystemModalActions.selectActiveTab(newActiveTab)),
        setSelectedSystemIds: () => dispatch(compareActions.setSelectedSystemIds()),
        fetchBaselines: () => dispatch(baselinesTableActions.fetchBaselines())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSystemModal);
