import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '@patternfly/react-core';
import { connect } from 'react-redux';

import SystemsTable from '../SystemsTable/SystemsTable';
import { compareActions } from '../modules';

class AddSystemModal extends Component {
    constructor(props) {
        super(props);
        this.confirmModal = this.confirmModal.bind(this);
        this.cancelSelection = this.cancelSelection.bind(this);
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

    render() {

        return (
            <React.Fragment>
                <Modal
                    title="Choose systems"
                    isOpen={ this.props.showModal }
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
                    <SystemsTable selectedSystemIds={ this.selectedSystemIds() }/>
                </Modal>
            </React.Fragment>
        );
    }
}

AddSystemModal.propTypes = {
    showModal: PropTypes.bool,
    confirmModal: PropTypes.func,
    setSelectedSystemIds: PropTypes.func,
    cancelSelection: PropTypes.func,
    toggleModal: PropTypes.func,
    entities: PropTypes.object,
    systems: PropTypes.array
};

function mapStateToProps(state) {
    return {
        systems: state.compareReducer.systems,
        entities: state.entities
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleModal: () => dispatch(compareActions.toggleAddSystemModal()),
        setSelectedSystemIds: () => dispatch(compareActions.setSelectedSystemIds())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSystemModal);
