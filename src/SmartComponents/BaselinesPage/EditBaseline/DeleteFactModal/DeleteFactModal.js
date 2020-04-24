import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from '@patternfly/react-core';

import { editBaselineActions } from '../redux';
import editBaselineHelpers from '../helpers';

class DeleteFactModal extends Component {
    constructor(props) {
        super(props);
        this.deleteFacts = this.deleteFacts.bind(this);

        this.state = {
            modalOpened: this.props.modalOpened
        };
    }

    async deleteFacts() {
        const { patchBaseline, fetchBaselineData, baselineData, editBaselineTableData } = this.props;
        let apiBody = editBaselineHelpers.makeDeleteFactsPatch(editBaselineTableData, baselineData);

        let results = await patchBaseline(baselineData.id, apiBody);
        if (results) {
            fetchBaselineData(baselineData.id);
        }

        this.props.toggleModal();
    }

    render() {
        const { modalOpened } = this.state;
        const { deleteFact, categoryMessage, factMessage } = this.props;

        return (
            <Modal
                title="Delete facts"
                className="small-modal-body"
                isOpen={ modalOpened }
                onClose={ this.props.toggleModal }
                width="auto"
                isFooterLeftAligned
                actions = { [
                    <Button
                        key="confirm"
                        variant="danger"
                        onClick={ deleteFact ? deleteFact : this.deleteFacts }
                    >
                    Delete facts
                    </Button>,
                    <Button
                        key="cancel"
                        variant="secondary"
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
    patchBaseline: PropTypes.func,
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
        patchBaseline: (baselineId, newBaselineBody) => dispatch(editBaselineActions.patchBaseline(baselineId, newBaselineBody)),
        fetchBaselineData: (baselineUUID) => dispatch(editBaselineActions.fetchBaselineData(baselineUUID))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFactModal);
