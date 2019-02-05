import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '@patternfly/react-core';

export class AddSystemModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <React.Fragment>
                <Modal
                    title="Add System"
                    isOpen={ this.props.showModal }
                    onClose={ this.handleModalToggle }
                    actions={ [
                        <Button key="cancel" variant="secondary" onClick={ this.props.getAddSystemModal }>
                            Cancel
                        </Button>,
                        <Button key="confirm" variant="primary" onClick={ this.props.getAddSystemModal }>
                            Confirm
                        </Button>
                    ] }
                >
                    This is a sample modal.
                </Modal>
            </React.Fragment>
        );
    }
}

AddSystemModal.propTypes = {
    showModal: PropTypes.bool,
    getAddSystemModal: PropTypes.func
};

