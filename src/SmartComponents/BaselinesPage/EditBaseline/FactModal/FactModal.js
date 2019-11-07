import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Checkbox, Form, FormGroup, Modal, TextInput } from '@patternfly/react-core';

import { factModalActions } from '../FactModal/redux';
import { baselinesTableActions } from '../../../BaselinesTable/redux';
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
        this.patchFact = this.patchFact.bind(this);

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

    confirmModal() {
        const { toggleFactModal } = this.props;
        const { isAddFact } = this.state;

        if (isAddFact) {
            this.addFact();
        } else {
            this.editFact();
        }

        toggleFactModal();
    }

    addFact() {
        const { isCategory, factName, factValue, factData } = this.state;

        let newFactData = editBaselineHelpers.buildNewFactData(isCategory, factName, factValue, factData);
        this.patchFact(newFactData, factData);
    }

    editFact() {
        const { isCategory, factName, factValue, factData } = this.state;

        let editedFactData = editBaselineHelpers.buildEditedFactData(
            isCategory, this.props.factName, factName, this.props.factValue, factValue, factData
        );

        this.patchFact(editedFactData, factData);
    }

    patchFact(patchData, factData) {
        const { baselineData, patchBaseline } = this.props;

        let newAPIBody = editBaselineHelpers.makeAddFactPatch(patchData, baselineData, factData);
        patchBaseline(baselineData.id, newAPIBody);
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

    renderFactInput() {
        const { factName, isCategory } = this.state;

        return (
            <div className="fact-value">
                <Form>
                    <FormGroup
                        label={ isCategory ? 'Category name' : 'Fact name' }
                        isRequired
                        fieldId='fact name'>
                        <TextInput
                            value={ factName }
                            type="text"
                            placeholder="Name"
                            onChange={ this.handleNewName }
                            isValid={ factName !== '' && factName !== undefined ? true : false }
                            aria-label="fact name"
                        />
                    </FormGroup>
                </Form>
            </div>
        );
    }

    renderValueInput() {
        const { factValue } = this.state;

        return (
            <div className="fact-value">
                <Form>
                    <FormGroup
                        label='Value'
                        isRequired
                        fieldId='fact value'>
                        <TextInput
                            value={ factValue }
                            type="text"
                            placeholder="Value"
                            onChange={ this.handleNewValue }
                            isValid={ factValue !== '' && factValue !== undefined ? true : false }
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
    factData: PropTypes.obj,
    isCategory: PropTypes.bool,
    isSubFact: PropTypes.bool,
    baselineData: PropTypes.obj,
    patchBaseline: PropTypes.func
};

function mapStateToProps(state) {
    return {
        factModalOpened: state.factModalState.factModalOpened,
        factName: state.factModalState.factName,
        factValue: state.factModalState.factValue,
        factData: state.factModalState.factData,
        isCategory: state.factModalState.isCategory,
        isSubFact: state.factModalState.isSubFact,
        baselineData: state.baselinesTableState.baselineData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleFactModal: () => dispatch(factModalActions.toggleFactModal()),
        patchBaseline: (baselineId, newBaselineBody) => dispatch(baselinesTableActions.patchBaseline(baselineId, newBaselineBody))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FactModal);
