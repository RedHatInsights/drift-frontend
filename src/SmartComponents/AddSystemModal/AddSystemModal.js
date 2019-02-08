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
    }

    confirmModal() {
        this.props.confirmModal(this.props.selectedSystemIds);
        this.props.toggleModal();
    }

    render() {

        return (
            <React.Fragment>
                <Modal
                    title="Add System"
                    isOpen={ this.props.showModal }
                    onClose={ this.confirmModal }
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
    toggleModal: PropTypes.func
};

function mapStateToProps(state) {
    return {
        selectedSystemIds: state.compareReducer.selectedSystemIds
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleModal: () => dispatch(compareActions.toggleAddSystemModal())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSystemModal);
