import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Checkbox, Modal, TextInput } from '@patternfly/react-core';

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

        this.state = {
            factName: this.props.factName,
            valueName: this.props.valueName,
            factData: this.props.factData
        };

        if (this.props.factName !== '' && this.props.valueName === '') {
            this.state.categoryCheck = true;
        } else {
            this.state.categoryCheck = false;
        }

        this.handleChange = (checked) => {
            this.setState({ categoryCheck: checked });
        };

        this.handleNewName = value => {
            this.setState({ factName: value });
        };

        this.handleNewValue = value => {
            this.setState({ valueName: value });
        };
    }

    cancelFact() {
        const { toggleFactModal } = this.props;

        toggleFactModal();
    }

    confirmModal() {
        const { toggleFactModal, factName, valueName } = this.props;

        if ((factName === '' && valueName === '')
        || (factName === undefined && valueName === undefined)) {
            this.addFact();
        } else {
            this.editFact();
        }

        toggleFactModal();
    }

    addFact() {
        const { categoryCheck, factName, valueName, factData } = this.state;
        const { baselineData, patchBaseline } = this.props;

        let newFactData = editBaselineHelpers.buildNewFactData(categoryCheck, factName, valueName, factData);
        let newAPIBody = editBaselineHelpers.makeAddFactPatch(newFactData, baselineData, factData);
        patchBaseline(baselineData.id, newAPIBody);
    }

    editFact() {
        const { categoryCheck, factName, valueName, factData } = this.state;
        const { baselineData, patchBaseline } = this.props;

        let editedFactData = editBaselineHelpers.buildEditedFactData(
            categoryCheck, this.props.factName, factName, this.props.valueName, valueName, factData
        );
        let newAPIBody = editBaselineHelpers.makeAddFactPatch(editedFactData, baselineData, factData);
        patchBaseline(baselineData.id, newAPIBody);
    }

    renderCategoryCheckbox() {
        const { categoryCheck } = this.state;
        const { factName, valueName } = this.props;
        let categoryCheckBody;

        if (factName !== '' && valueName === '') {
            categoryCheckBody = <Checkbox
                label="This is a category"
                aria-label="controlled checkbox example"
                id="categoryCheck"
                name="isCategory"
                defaultChecked
                isDisabled
            />;
        } else if (factName !== '' && valueName !== '') {
            categoryCheckBody = <Checkbox
                label="This is a category"
                aria-label="controlled checkbox example"
                id="categoryCheck"
                name="isCategory"
                isDisabled
            />;
        } else {
            categoryCheckBody = <Checkbox
                label="This is a category"
                isChecked={ categoryCheck }
                onChange={ this.handleChange }
                aria-label="controlled checkbox example"
                id="categoryCheck"
                name="isCategory"
            />;
        }

        return categoryCheckBody;
    }

    renderFactInput() {
        const { factName } = this.state;
        let factInputBody;

        factInputBody = <div className="fact-value">
            Fact name:
            <br></br>
            <TextInput
                value={ factName }
                type="text"
                placeholder="Name"
                onChange={ this.handleNewName }
                isValid={ factName !== '' ? true : false }
                aria-label="fact name"
            />
        </div>;

        return factInputBody;
    }

    renderValueInput() {
        const { categoryCheck, valueName } = this.state;
        let valueInput;
        let valueInputBody;

        if (categoryCheck) {
            valueInput = <TextInput
                type="text"
                aria-label="value"
                isDisabled
            />;
        } else {
            valueInput = <TextInput
                value={ valueName }
                type="text"
                placeholder="Value"
                onChange={ this.handleNewValue }
                isValid={ valueName !== '' ? true : false }
                aria-label="value"
            />;
        }

        valueInputBody = <div className="fact-value">
            Value:
            <br></br>
            { valueInput }
        </div>;

        return valueInputBody;

    }

    renderModalBody() {
        let modalBody;

        modalBody = <React.Fragment>
            { this.renderCategoryCheckbox() }
            { this.renderFactInput() }
            <br></br>
            { this.renderValueInput() }
        </React.Fragment>;

        return modalBody;
    }

    render() {
        const { factModalOpened } = this.props;

        return (
            <Modal
                title="Fact add/edit"
                isOpen={ factModalOpened }
                onClose={ this.cancelFact }
                width="auto"
                actions={ [
                    <Button
                        key="confirm"
                        variant="primary"
                        onClick={ this.confirmModal }>
                        Save
                    </Button>,
                    <Button
                        key="cancel"
                        variant="primary"
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
    valueName: PropTypes.string,
    factData: PropTypes.obj,
    baselineData: PropTypes.obj,
    patchBaseline: PropTypes.func
};

function mapStateToProps(state) {
    return {
        factModalOpened: state.factModalState.factModalOpened,
        factName: state.factModalState.factName,
        valueName: state.factModalState.valueName,
        factData: state.factModalState.factData,
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
