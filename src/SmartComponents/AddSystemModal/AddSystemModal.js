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

    confirmModal() {
        this.props.confirmModal(this.props.selectedSystemIds);
        this.props.toggleModal();
    }

    cancelSelection() {
        this.props.resetSelectedSystemIds();
        this.props.toggleModal();
    }

    render() {

        return (
            <React.Fragment>
                <Modal
                    title="Add system"
                    isOpen={ this.props.showModal }
                    onClose={ this.cancelSelection }
                    actions={ [
                        <Button
                            key="confirm"
                            variant="primary"
                            onClick={ this.confirmModal }>
                            Compare
                        </Button>
                    ] }
                >
                    <SystemsTable selectedSystemIds={ this.props.selectedSystemIds }/>
                </Modal>
            </React.Fragment>
        );
    }
}

AddSystemModal.propTypes = {
    selectedSystemIds: PropTypes.array,
    showModal: PropTypes.bool,
    confirmModal: PropTypes.func,
    resetSelectedSystemIds: PropTypes.func,
    cancelSelection: PropTypes.func,
    toggleModal: PropTypes.func
};

function mapStateToProps(state) {
    return {
        selectedSystemIds: state.compareReducer.selectedSystemIds
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleModal: () => dispatch(compareActions.toggleAddSystemModal()),
        resetSelectedSystemIds: () => dispatch(compareActions.resetSelectedSystemIds())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSystemModal);
