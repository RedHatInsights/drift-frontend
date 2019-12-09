import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import PropTypes from 'prop-types';
import { Button, Modal, Tab, Tabs } from '@patternfly/react-core';
import { connect } from 'react-redux';
import { withCookies, Cookies } from 'react-cookie';

import SystemsTable from '../SystemsTable/SystemsTable';
import BaselinesTable from '../BaselinesTable/BaselinesTable';
import { addSystemModalActions } from './redux';

class AddSystemModal extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

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
        const { confirmModal, entities, selectedBaselineIds, toggleModal } = this.props;

        confirmModal(entities.selectedSystemIds, selectedBaselineIds);
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

    selectedBaselineIds() {
        let ids = this.props.baselines.map(function (baseline) {
            return baseline.id;
        });

        return ids ? ids : [];
    }

    changeActiveTab(event, tabIndex) {
        const { selectActiveTab } = this.props;

        selectActiveTab(tabIndex);
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
                    isFooterLeftAligned
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
                            <BaselinesTable hasSelect={ true }/>
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
    baselines: PropTypes.array
};

function mapStateToProps(state) {
    return {
        addSystemModalOpened: state.addSystemModalState.addSystemModalOpened,
        systems: state.compareState.systems,
        activeTab: state.addSystemModalState.activeTab,
        entities: state.entities,
        selectedBaselineIds: state.baselinesTableState.selectedBaselineIds,
        baselines: state.compareState.baselines
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleModal: () => dispatch(addSystemModalActions.toggleAddSystemModal()),
        selectActiveTab: (newActiveTab) => dispatch(addSystemModalActions.selectActiveTab(newActiveTab))
    };
}

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(AddSystemModal));
