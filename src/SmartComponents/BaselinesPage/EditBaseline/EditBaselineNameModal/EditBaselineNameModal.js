import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Modal, TextInput } from '@patternfly/react-core';

import { editBaselineActions } from '../redux';

class EditBaselineNameModal extends Component {
    constructor(props) {
        super(props);

        /*eslint-disable camelcase*/
        this.state = {
            baselineName: this.props.baselineData.display_name
        };
        /*eslint-enable camelcase*/

        this.updateBaselineName = (value) => {
            this.setState({ baselineName: value });
        };

        this.confirmModal = this.confirmModal.bind(this);
    }

    async confirmModal() {
        const { baselineName } = this.state;
        const { baselineData, patchBaseline, toggleEditNameModal } = this.props;

        try {
            /*eslint-disable camelcase*/
            await patchBaseline(baselineData.id, { display_name: baselineName, facts_patch: []});
            /*eslint-enable camelcase*/

            toggleEditNameModal();
        } catch (e) {
            // do nothing and let redux handle
        }
    }

    cancelModal = () => {
        const { toggleEditNameModal, baselineData } = this.props;

        /*eslint-disable camelcase*/
        this.updateBaselineName(baselineData.display_name);
        /*eslint-enable camelcase*/
        toggleEditNameModal();
    }

    checkKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.confirmModal();
        }
    }

    renderModalBody() {
        const { baselineName } = this.state;
        const { error } = this.props;

        return (<div className='fact-value'>
            <Form>
                <FormGroup
                    label='Baseline title'
                    isRequired
                    fieldId='baseline name'
                    helperTextInvalid={ error.hasOwnProperty('detail') ? error.detail : null }
                    isValid={ !error.hasOwnProperty('status') }
                    onKeyPress={ this.checkKeyPress }
                >
                    <TextInput
                        value={ baselineName }
                        type="text"
                        onChange={ this.updateBaselineName }
                        isValid={ !error.hasOwnProperty('status') }
                        aria-label="baseline name"
                    />
                </FormGroup>
            </Form>
        </div>);
    }

    render() {
        const { editNameModalOpened } = this.props;

        return (
            <Modal
                className='pf-c-modal-box'
                title="Edit title"
                isOpen={ editNameModalOpened }
                onClose={ this.cancelModal }
                width="auto"
                isFooterLeftAligned
                actions={ [
                    <Button
                        key="confirm"
                        variant="primary"
                        onClick={ this.confirmModal }>
                        Save
                    </Button>,
                    <Button
                        key="cancel"
                        variant="secondary"
                        onClick={ this.cancelModal }>
                        Cancel
                    </Button>
                ] }
            >
                { this.renderModalBody() }
            </Modal>
        );
    };
}

EditBaselineNameModal.propTypes = {
    baselineId: PropTypes.string,
    baselineName: PropTypes.string,
    baselineData: PropTypes.array,
    editNameModalOpened: PropTypes.bool,
    toggleEditNameModal: PropTypes.func,
    patchBaseline: PropTypes.func,
    error: PropTypes.object
};

function mapStateToProps(state) {
    return {
        baselineData: state.editBaselineState.baselineData,
        editNameModalOpened: state.editBaselineState.editNameModalOpened,
        error: state.editBaselineState.error
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleEditNameModal: () => dispatch(editBaselineActions.toggleEditNameModal()),
        patchBaseline: (baselineId, newBaselineBody) => dispatch(editBaselineActions.patchBaseline(baselineId, newBaselineBody))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBaselineNameModal);
