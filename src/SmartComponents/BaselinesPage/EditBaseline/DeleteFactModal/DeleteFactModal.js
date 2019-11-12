import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Button } from '@patternfly/react-core';

import { editBaselineActions } from '../redux';
import editBaselineHelpers from '../helpers';
import deleteFactModalHelpers from './helpers';

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

    buildMessage = (categoryMessage, factMessage) => {
        let numFactsMessage;
        let deleteCatMessage;
        let message;

        if (categoryMessage && factMessage) {
            numFactsMessage = 'You have selected ' + categoryMessage + ' and ' + factMessage + ' to be deleted.';
            deleteCatMessage = 'Deleting a category will delete all facts within the category.';
            message = <div>
                <span className='display-block'>{ numFactsMessage }</span>
                <span className='display-block'>{ deleteCatMessage }</span>
            </div>;
        } else if (categoryMessage) {
            numFactsMessage = 'You have selected ' + categoryMessage + ' to be deleted.';
            deleteCatMessage = 'Deleting a category will delete all facts within the category.';
            message = <div>
                <span className='display-block'>{ numFactsMessage }</span>
                <span className='display-block'>{ deleteCatMessage }</span>
            </div>;
        } else if (factMessage) {
            numFactsMessage = 'You have selected ' + factMessage + ' to be deleted.';
            message = <div>
                <span className='display-block'>{ numFactsMessage }</span>
            </div>;
        }

        return message;
    }

    factCountMessage = () => {
        const { editBaselineTableData } = this.props;
        let categoryMessage;
        let factMessage;
        let message;

        let factCounts = deleteFactModalHelpers.countFacts(editBaselineTableData);

        if (factCounts.categories === 1) {
            categoryMessage = '1 category';
        } else if (factCounts.categories > 1) {
            categoryMessage = factCounts.categories + ' categories';
        }

        if (factCounts.facts === 1) {
            factMessage = '1 fact';
        } else if (factCounts.facts > 1) {
            factMessage = factCounts.facts + ' facts';
        }

        message = this.buildMessage(categoryMessage, factMessage);

        return message;
    }

    render() {
        const { modalOpened } = this.state;
        const { deleteFact, isCategory } = this.props;
        let message;

        if (deleteFact) {
            if (isCategory) {
                message = this.buildMessage('1 category', null);
            } else {
                message = this.buildMessage(null, '1 fact');
            }
        } else {
            message = this.factCountMessage();
        }

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
                { message }
                { <br></br> }
                This cannot be undone.
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
    isCategory: PropTypes.bool
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
