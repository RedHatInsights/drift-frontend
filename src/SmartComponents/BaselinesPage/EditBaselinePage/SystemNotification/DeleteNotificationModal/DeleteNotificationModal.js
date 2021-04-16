import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalVariant } from '@patternfly/react-core';

export class DeleteNotificationModal extends Component {
    constructor(props) {
        super(props);
    }

    /*eslint-disable camelcase*/
    deleteNotification = async () => {
        const { baselineId, deleteNotifications, fetchSystems, systemsToDelete, toggleDeleteNotificationsModal } = this.props;

        await deleteNotifications(baselineId, systemsToDelete);
        fetchSystems(baselineId);
        toggleDeleteNotificationsModal();
    }
    /*eslint-enable camelcase*/

    render() {
        const { deleteNotificationsModalOpened, systemsToDelete, toggleDeleteNotificationsModal } = this.props;

        return (
            <React.Fragment>
                <Modal
                    className="drift"
                    ouiaId='delete-baseline-notification-modal'
                    variant={ ModalVariant.small }
                    title="Delete baseline notificatoin"
                    isOpen={ deleteNotificationsModalOpened }
                    onClose={ () => toggleDeleteNotificationsModal() }
                    actions = { [
                        <Button
                            key="confirm"
                            ouiaId='delete-baseline-notification-button'
                            variant="danger"
                            onClick={ this.deleteNotification }
                        >
                            { systemsToDelete?.length > 1 ? 'Delete notifications' : 'Delete notification' }
                        </Button>,
                        <Button
                            key="cancel"
                            ouiaId='delete-baseline-notification-cancel-button'
                            variant="link"
                            onClick={ () => toggleDeleteNotificationsModal() }
                        >
                        Cancel
                        </Button>
                    ] }
                >
                    You have selected { ' ' } { systemsToDelete?.length > 1 ? 'multiple baseline notifications' : null }
                    { ' ' } to be deleted.
                    <br></br>
                    { <div className="md-padding-top">Deleting a baseline notification cannot be undone.</div> }
                </Modal>
            </React.Fragment>
        );
    }
}

DeleteNotificationModal.propTypes = {
    baselineId: PropTypes.string,
    deleteNotificationsModalOpened: PropTypes.bool,
    deleteNotifications: PropTypes.func,
    fetchSystems: PropTypes.func,
    systemsToDelete: PropTypes.array,
    toggleDeleteNotificationsModal: PropTypes.func
};

export default DeleteNotificationModal;
