import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert, Button, Checkbox, Form, FormGroup, Modal, ModalVariant, TextInput, ValidatedOptions } from '@patternfly/react-core';

import { editBaselineActions } from '../redux';
import editBaselineHelpers from '../helpers';

export class FactModal extends Component {
    constructor(props) {
        super(props);

        this.cancelFact = this.cancelFact.bind(this);
        this.confirmModal = this.confirmModal.bind(this);
        this.renderCategoryCheckbox = this.renderCategoryCheckbox.bind(this);
        this.renderFactInput = this.renderFactInput.bind(this);
        this.renderValueInput = this.renderValueInput.bind(this);
        this.renderModalBody = this.renderModalBody.bind(this);

        this.state = {
            factName: this.props.factName,
            factValue: this.props.factValue,
            factData: this.props.factData,
            isCategory: this.props.isCategory
        };

        this.state.isAddFact = this.props.factName === '' && this.props.factValue === '';
        this.state.isEditFact = this.props.factName !== '' && this.props.factValue !== '';

        this.handleChange = checked => {
            this.setState({ isCategory: checked });
        };

        this.handleNewName = value => {
            this.setState({ factName: value });
        };

        this.handleNewValue = value => {
            this.setState({ factValue: value });
        };
    }

    cancelFact() {
        const { toggleFactModal } = this.props;

        toggleFactModal();
    }

    async confirmModal() {
        const { toggleFactModal, baselineData, patchBaseline, fetchBaselineData } = this.props;
        const { isAddFact } = this.state;
        let newAPIBody = '';

        try {
            if (isAddFact) {
                newAPIBody = this.addFact(baselineData);
            } else {
                newAPIBody = this.editFact(baselineData);
            }

            let results = await patchBaseline(baselineData.id, newAPIBody);
            if (results) {
                fetchBaselineData(baselineData.id);
            }

            toggleFactModal();
        } catch (e) {
            // do nothing and let redux handle
        }
    }

    addFact(baselineData) {
        const { isCategory, factName, factValue, factData } = this.state;

        let newFactData = editBaselineHelpers.buildNewFactData(isCategory, factName, factValue, factData);

        return editBaselineHelpers.makeAddFactPatch(newFactData, baselineData);
    }

    editFact(baselineData) {
        const { isCategory, factName, factValue, factData } = this.state;

        let editedFactData = editBaselineHelpers.buildEditedFactData(
            isCategory, this.props.factName, factName, this.props.factValue, factValue, factData
        );
        return editBaselineHelpers.makeEditFactPatch(editedFactData, baselineData, factData);
    }

    renderCategoryCheckbox() {
        const { isCategory, isEditFact } = this.state;

        return <Checkbox
            className="sm-padding-bottom"
            aria-label="controlled checkbox example"
            label="This is a category"
            id="isCategory"
            name="isCategory"
            onChange={ this.handleChange }
            isChecked={ isCategory }
            isDisabled={ isCategory && isEditFact }
        />;
    }

    checkKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.confirmModal();
        }
    }

    renderFactInput() {
        const { inlineError } = this.props;
        const { factName, isCategory } = this.state;

        return (
            <div className="fact-value">
                <FormGroup
                    label={ isCategory ? 'Category name' : 'Fact name' }
                    isRequired
                    helperTextInvalid={ inlineError.hasOwnProperty('detail') ? inlineError.detail : null }
                    validated={ inlineError.hasOwnProperty('status') ? 'error' : null }
                    fieldId='fact name'
                    onKeyPress={ this.checkKeyPress }
                >
                    <TextInput
                        value={ factName }
                        type="text"
                        placeholder="Name"
                        onChange={ this.handleNewName }
                        validated={ inlineError.hasOwnProperty('status') ? ValidatedOptions.error : null }
                        aria-label="fact name"
                    />
                </FormGroup>
            </div>
        );
    }

    renderValueInput() {
        const { inlineError } = this.props;
        const { factValue } = this.state;

        return (
            <div className="fact-value">
                <FormGroup
                    label='Value'
                    isRequired
                    helperTextInvalid={ inlineError.hasOwnProperty('detail') ? inlineError.detail : null }
                    validated={ inlineError.hasOwnProperty('status') ? 'error' : null }
                    fieldId='fact value'
                    onKeyPress={ this.checkKeyPress }
                >
                    <TextInput
                        value={ factValue }
                        type="text"
                        placeholder="Value"
                        onChange={ this.handleNewValue }
                        validated={ inlineError.hasOwnProperty('status') ? ValidatedOptions.error : null }
                        aria-label="value"
                    />
                </FormGroup>
            </div>
        );
    }

    renderModalBody() {
        const { inlineError, isSubFact } = this.props;
        const { isAddFact, isCategory } = this.state;
        let modalBody;

        modalBody =
            <React.Fragment>
                { inlineError.status
                    ? <Alert
                        variant='danger'
                        isInline
                        title={ 'Status: ' + inlineError.status }
                    >
                        <p>
                            { inlineError.detail }
                        </p>
                    </Alert>
                    : <div></div>
                }
                { (isAddFact && !isSubFact) || isCategory ? this.renderCategoryCheckbox() : null }
                <Form>
                    { this.renderFactInput() }
                    { isCategory ? null : this.renderValueInput() }
                </Form>
            </React.Fragment>;

        return modalBody;
    }

    title() {
        const { isSubFact } = this.props;
        const { isAddFact, isEditFact, isCategory } = this.state;
        let title = 'Add fact';

        if (isEditFact === true && !isCategory && !isSubFact) {
            title = 'Edit fact';
        } else if (isAddFact === true && isCategory === true) {
            title = 'Add category';
        } else if (isAddFact === true && isSubFact === true) {
            title = 'Add sub fact';
        } else if (isEditFact === true && isSubFact === true) {
            title = 'Edit sub fact';
        } else if (isCategory === true) {
            title = 'Edit category';
        }

        return title;
    }

    render() {
        const { factModalOpened } = this.props;

        return (
            <Modal
                variant={ ModalVariant.small }
                title={ this.title() }
                isOpen={ factModalOpened }
                onClose={ this.cancelFact }
                actions={ [
                    <Button
                        key="confirm"
                        variant="primary"
                        onClick={ this.confirmModal }>
                        Save
                    </Button>,
                    <Button
                        key="cancel"
                        variant="link"
                        onClick={ this.cancelFact }>
                        Cancel
                    </Button>
                ] }
            >
                { this.renderModalBody() }
            </Modal>
        );
    };
}

FactModal.propTypes = {
    toggleFactModal: PropTypes.func,
    factModalOpened: PropTypes.bool,
    factName: PropTypes.string,
    factValue: PropTypes.string,
    factData: PropTypes.object,
    isCategory: PropTypes.bool,
    isSubFact: PropTypes.bool,
    baselineData: PropTypes.object,
    patchBaseline: PropTypes.func,
    fetchBaselineData: PropTypes.func,
    inlineError: PropTypes.object
};

function mapStateToProps(state) {
    return {
        factModalOpened: state.editBaselineState.factModalOpened,
        factName: state.editBaselineState.factName,
        factValue: state.editBaselineState.factValue,
        factData: state.editBaselineState.factData,
        isCategory: state.editBaselineState.isCategory,
        isSubFact: state.editBaselineState.isSubFact,
        baselineData: state.editBaselineState.baselineData,
        inlineError: state.editBaselineState.inlineError
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleFactModal: () => dispatch(editBaselineActions.toggleFactModal()),
        patchBaseline: (baselineId, newBaselineBody) => dispatch(editBaselineActions.patchBaseline(baselineId, newBaselineBody)),
        fetchBaselineData: (baselineUUID) => dispatch(editBaselineActions.fetchBaselineData(baselineUUID))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FactModal);
