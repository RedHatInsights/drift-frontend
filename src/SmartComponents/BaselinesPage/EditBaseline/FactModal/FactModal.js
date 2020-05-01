import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Checkbox, Form, FormGroup, Modal, TextInput } from '@patternfly/react-core';

import { editBaselineActions } from '../redux';
import editBaselineHelpers from '../helpers';

class FactModal extends Component {
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
        const { error } = this.props;
        const { factName, isCategory } = this.state;

        return (
            <div className="fact-value">
                <Form>
                    <FormGroup
                        label={ isCategory ? 'Category name' : 'Fact name' }
                        isRequired
                        helperTextInvalid={ error.hasOwnProperty('detail') ? error.detail : null }
                        isValid={ !error.hasOwnProperty('status') }
                        fieldId='fact name'
                        onKeyPress={ this.checkKeyPress }
                    >
                        <TextInput
                            value={ factName }
                            type="text"
                            placeholder="Name"
                            onChange={ this.handleNewName }
                            isValid={ !error.hasOwnProperty('status') }
                            aria-label="fact name"
                        />
                    </FormGroup>
                </Form>
            </div>
        );
    }

    renderValueInput() {
        const { error } = this.props;
        const { factValue } = this.state;

        return (
            <div className="fact-value">
                <Form>
                    <FormGroup
                        label='Value'
                        isRequired
                        helperTextInvalid={ error.hasOwnProperty('detail') ? error.detail : null }
                        isValid={ !error.hasOwnProperty('status') }
                        fieldId='fact value'
                        onKeyPress={ this.checkKeyPress }
                    >
                        <TextInput
                            value={ factValue }
                            type="text"
                            placeholder="Value"
                            onChange={ this.handleNewValue }
                            isValid={ !error.hasOwnProperty('status') }
                            aria-label="value"
                        />
                    </FormGroup>
                </Form>
            </div>
        );
    }

    renderModalBody() {
        const { isSubFact } = this.props;
        const { isAddFact, isCategory } = this.state;
        let modalBody;

        modalBody = <React.Fragment>
            { (isAddFact && !isSubFact) || isCategory ? this.renderCategoryCheckbox() : null }
            { this.renderFactInput() }
            <br></br>
            { isCategory ? null : this.renderValueInput() }
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
                className="small-modal-body"
                title={ this.title() }
                isOpen={ factModalOpened }
                onClose={ this.cancelFact }
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
    error: PropTypes.object,
    fetchBaselineData: PropTypes.func
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
        error: state.editBaselineState.error
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
