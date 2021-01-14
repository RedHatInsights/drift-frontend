import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Modal, ModalVariant, TextInput, ValidatedOptions, Alert } from '@patternfly/react-core';

import { editBaselineActions } from '../redux';

export class EditBaselineNameModal extends Component {
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

        this.updateBaselineName(baselineData.display_name);
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
        const hasError = Object.prototype.hasOwnProperty.call(error, 'status')  ? ValidatedOptions.error : null;

        return (<div className='fact-value'>
            <Form>
                <FormGroup
                    label='Baseline title'
                    isRequired
                    fieldId='baseline name'
                    helperTextInvalid={ Object.prototype.hasOwnProperty.call(error, 'detail') ? error.detail : null }
                    validated={ hasError }
                    onKeyPress={ this.checkKeyPress }
                >
                    <TextInput
                        value={ baselineName }
                        type="text"
                        onChange={ this.updateBaselineName }
                        validated={ hasError }
                        aria-label="baseline name"
                    />
                </FormGroup>
            </Form>
        </div>);
    }

    render() {
        const { modalOpened, error } = this.props;

        return (
            <Modal
                variant={ ModalVariant.small }
                title="Edit name"
                isOpen={ modalOpened }
                onClose={ this.cancelModal }
                actions={ [
                    <Button
                        key="confirm"
                        variant="primary"
                        ouiaId="save"
                        onClick={ this.confirmModal }>
                        Save
                    </Button>,
                    <Button
                        key="cancel"
                        variant="link"
                        ouiaId="cancel"
                        onClick={ this.cancelModal }>
                        Cancel
                    </Button>
                ] }
            >
                { error.status && <Alert
                    variant='danger'
                    isInline
                    title={ 'Status: ' + error.status }
                >
                    <p>
                        { error.detail }
                    </p>
                </Alert> }
                { this.renderModalBody() }
            </Modal>
        );
    };
}

EditBaselineNameModal.propTypes = {
    baselineData: PropTypes.object,
    toggleEditNameModal: PropTypes.func,
    modalOpened: PropTypes.bool,
    patchBaseline: PropTypes.func,
    error: PropTypes.object
};

function mapDispatchToProps(dispatch) {
    return {
        patchBaseline: (baselineId, newBaselineBody) => dispatch(editBaselineActions.patchBaseline(baselineId, newBaselineBody))
    };
}

export default connect(null, mapDispatchToProps)(EditBaselineNameModal);
