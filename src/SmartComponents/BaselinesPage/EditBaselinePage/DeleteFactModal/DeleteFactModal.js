import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';

import { editBaselineActions } from '../redux';
import editBaselineHelpers from '../EditBaseline/helpers';

class DeleteFactModal extends Component {
    constructor(props) {
        super(props);
        this.deleteFacts = this.deleteFacts.bind(this);
    }

    async deleteFacts() {
        const { deleteBaselineData, fetchBaselineData, baselineData, editBaselineTableData } = this.props;
        let apiBody = editBaselineHelpers.makeDeleteFactsPatch(editBaselineTableData, baselineData);
        this.props.toggleModal();

        try {
            await deleteBaselineData(baselineData.id, apiBody);
            fetchBaselineData(baselineData.id);
        } catch (e) {
            // do nothing and let redux handle
        }
    }

    render() {
        const { deleteFact, categoryMessage, factMessage, modalOpened } = this.props;

        return (
            <Modal
                className="drift"
                ouiaId='delete-fact-modal'
                variant={ ModalVariant.small }
                title="Delete facts"
                isOpen={ modalOpened }
                onClose={ this.props.toggleModal }
                actions = { [
                    <Button
                        key="confirm"
                        ouiaId='delete-fact-button'
                        variant="danger"
                        onClick={ deleteFact ? deleteFact : this.deleteFacts }
                    >
                    Delete facts
                    </Button>,
                    <Button
                        key="cancel"
                        ouiaId='delete-fact-cancel-button'
                        variant="link"
                        onClick={ this.props.toggleModal }
                    >
                    Cancel
                    </Button>
                ] }
            >
                You have selected { ' ' }
                { categoryMessage ? <b>{ categoryMessage }</b> : null }
                { categoryMessage && factMessage ? ' and ' : null }
                { factMessage ? <b>{ factMessage }</b> : null }
                { ' ' } to be deleted.
                <br></br>
                { categoryMessage ?
                    'Deleting a category will delete all facts within the category.'
                    : null
                }
                { <div className="md-padding-top">This cannot be undone.</div> }
            </Modal>
        );
    }
}

DeleteFactModal.propTypes = {
    modalOpened: PropTypes.bool,
    deleteBaselineData: PropTypes.func,
    fetchBaselineData: PropTypes.func,
    editBaselineTableData: PropTypes.array,
    baselineData: PropTypes.object,
    toggleModal: PropTypes.func,
    deleteFact: PropTypes.func,
    categoryMessage: PropTypes.string,
    factMessage: PropTypes.string
};

function mapStateToProps(state) {
    return {
        baselineData: state.editBaselineState.baselineData,
        editBaselineTableData: state.editBaselineState.editBaselineTableData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteBaselineData: (baselineId, newBaselineBody) => dispatch(editBaselineActions.deleteBaselineData(baselineId, newBaselineBody)),
        fetchBaselineData: (baselineUUID) => dispatch(editBaselineActions.fetchBaselineData(baselineUUID))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFactModal);
