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
        this.patchFact = this.patchFact.bind(this);

        this.state = {
            factName: this.props.factName,
            factValue: this.props.factValue,
            factData: this.props.factData
        };

        if (this.props.factName !== '' && this.props.factValue === '') {
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
            this.setState({ factValue: value });
        };
    }

    cancelFact() {
        const { toggleFactModal } = this.props;

        toggleFactModal();
    }

    confirmModal() {
        const { toggleFactModal, factName, factValue } = this.props;

        if ((factName === '' && factValue === '')
        || (factName === undefined && factValue === undefined)) {
            this.addFact();
        } else {
            this.editFact();
        }

        toggleFactModal();
    }

    addFact() {
        const { categoryCheck, factName, factValue, factData } = this.state;

        let newFactData = editBaselineHelpers.buildNewFactData(categoryCheck, factName, factValue, factData);
        this.patchFact(newFactData, factData);
    }

    editFact() {
        const { categoryCheck, factName, factValue, factData } = this.state;

        let editedFactData = editBaselineHelpers.buildEditedFactData(
            categoryCheck, this.props.factName, factName, this.props.factValue, factValue, factData
        );

        this.patchFact(editedFactData, factData);
    }

    patchFact(patchData, factData) {
        const { baselineData, patchBaseline } = this.props;

        let newAPIBody = editBaselineHelpers.makeAddFactPatch(patchData, baselineData, factData);
        patchBaseline(baselineData.id, newAPIBody);
    }

    renderCategoryCheckbox() {
        const { categoryCheck } = this.state;
        const { factName, factValue } = this.props;
        let categoryCheckBody;

        if (factName !== '' && factValue === '') {
            categoryCheckBody = <Checkbox
                label="This is a category"
                aria-label="controlled checkbox example"
                id="categoryCheck"
                name="isCategory"
                defaultChecked
                isDisabled
            />;
        } else if (factName !== '' && factValue !== '') {
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
                isValid={ factName !== '' && factName !== undefined ? true : false }
                aria-label="fact name"
            />
        </div>;

        return factInputBody;
    }

    renderValueInput() {
        const { categoryCheck, factValue } = this.state;
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
                value={ factValue }
                type="text"
                placeholder="Value"
                onChange={ this.handleNewValue }
                isValid={ factValue !== '' && factValue !== undefined ? true : false }
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
    factValue: PropTypes.string,
    factData: PropTypes.obj,
    baselineData: PropTypes.obj,
    patchBaseline: PropTypes.func
};

function mapStateToProps(state) {
    return {
        factModalOpened: state.factModalState.factModalOpened,
        factName: state.factModalState.factName,
        factValue: state.factModalState.factValue,
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
