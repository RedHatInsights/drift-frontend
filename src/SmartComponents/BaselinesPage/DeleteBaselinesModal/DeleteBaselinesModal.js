import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';

import { baselinesTableActions } from '../../BaselinesTable/redux/index';

export class DeleteBaselinesModal extends Component {
    constructor(props) {
        super(props);
        this.deleteBaselines = this.deleteBaselines.bind(this);
    }

    async deleteBaselines() {
        const {
            clearSelectedBaselines,
            deleteSelectedBaselines,
            selectedBaselineIds,
            fetchWithParams,
            baselineId,
            tableId,
            toggleModal
        } = this.props;
        let apiBody;

        /*eslint-disable camelcase*/
        if (baselineId) {
            apiBody = { baseline_ids: [ baselineId ]};
        } else {
            apiBody = { baseline_ids: selectedBaselineIds };
        }
        /*eslint-enable camelcase*/

        toggleModal();

        try {
            await deleteSelectedBaselines(apiBody, tableId);
            clearSelectedBaselines(tableId);
            fetchWithParams();
        } catch (e) {
            // do nothing and let redux handle
        }
    }

    render() {
        const { baselineId, modalOpened, selectedBaselineIds, toggleModal } = this.props;
        const deleteMessage = baselineId || selectedBaselineIds.length === 1 ? 'Delete baseline' : 'Delete baselines';

        return (
            <Modal
                className="drift"
                variant={ ModalVariant.small }
                title={ deleteMessage }
                isOpen={ modalOpened }
                onClose={ toggleModal }
                ouiaId="delete-baseline-modal"
                actions = { [
                    <Button
                        key="confirm"
                        variant="danger"
                        onClick={ this.deleteBaselines }
                        ouiaId="delete-baseline-modal-submit-button"
                    >
                        { deleteMessage }
                    </Button>,
                    <Button
                        key="cancel"
                        variant="link"
                        onClick={ toggleModal }
                        ouiaId="delete-baseline-modal-cancel-button"
                    >
                    Cancel
                    </Button>
                ] }
            >
                Deleting a baseline is permanent and cannot be undone.
            </Modal>
        );
    }
}

DeleteBaselinesModal.propTypes = {
    modalOpened: PropTypes.bool,
    clearSelectedBaselines: PropTypes.func,
    selectedBaselineIds: PropTypes.array,
    deleteSelectedBaselines: PropTypes.func,
    fetchWithParams: PropTypes.func,
    baselineId: PropTypes.string,
    tableId: PropTypes.string,
    toggleModal: PropTypes.func,
    revertBaselineFetch: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        deleteSelectedBaselines: (apiBody, tableId) => dispatch(baselinesTableActions.deleteSelectedBaselines(apiBody, tableId)),
        clearSelectedBaselines: (tableId) => dispatch(baselinesTableActions.clearSelectedBaselines(tableId)),
        revertBaselineFetch: (tableId) => dispatch(baselinesTableActions.revertBaselineFetch(tableId))
    };
}

export default connect(null, mapDispatchToProps)(DeleteBaselinesModal);
