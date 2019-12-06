import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Modal, Radio, TextInput, Form, FormGroup } from '@patternfly/react-core';

import SystemsTable from '../../SystemsTable/SystemsTable';
import BaselinesTable from '../../BaselinesTable/BaselinesTable';
import { createBaselineModalActions } from './redux';

class CreateBaselineModal extends Component {
    constructor(props) {
        super(props);

        this.submitBaselineName = this.submitBaselineName.bind(this);
        this.isBaselineSelected = this.isBaselineSelected.bind(this);

        this.state = {
            baselineName: '',
            fromScratchChecked: true,
            copyBaselineChecked: false,
            copySystemChecked: false,
            selectedBaseline: ''
        };

        this.updateBaselineName = value => {
            this.setState({ baselineName: value });
        };

        this.handleChecked = (_, event) => {
            const { value } = event.currentTarget;
            let fromScratchChecked = false;
            let copyBaselineChecked = false;
            let copySystemChecked = false;

            if (value === 'fromScratchChecked') {
                fromScratchChecked = true;
            } else if (value === 'copyBaselineChecked') {
                copyBaselineChecked = true;
            } else {
                copySystemChecked = true;
            }

            this.setState({
                fromScratchChecked,
                copyBaselineChecked,
                copySystemChecked,
                selectedBaseline: ''
            });
        };
    }

    isBaselineSelected(baselineId) {
        this.setState({ selectedBaseline: baselineId });
    }

    async submitBaselineName() {
        const { baselineName, fromScratchChecked, copyBaselineChecked, copySystemChecked, selectedBaseline } = this.state;
        const { createBaseline, toggleModal, history, entities } = this.props;
        /*eslint-disable camelcase*/
        let newBaselineObject = { display_name: baselineName };

        try {
            if (baselineName !== '') {
                if (fromScratchChecked) {
                    newBaselineObject.baseline_facts = [];
                    await createBaseline(newBaselineObject);
                } else if (selectedBaseline.length !== '' && copyBaselineChecked) {
                    newBaselineObject = { display_name: baselineName };
                    await createBaseline(newBaselineObject, selectedBaseline);
                } else if (entities.selectedSystemIds.length === 1 && copySystemChecked) {
                    newBaselineObject.inventory_uuid = entities.selectedSystemIds[0];
                    await createBaseline(newBaselineObject);
                }

                history.push('baselines/' + this.props.baselineData.id);
                toggleModal();
            }
        } catch (e) {
            // do nothing and let redux handle
        }
        /*eslint-enable camelcase*/
    }

    cancelModal = () => {
        const { toggleModal } = this.props;

        this.updateBaselineName('');
        toggleModal();
    }

    renderRadioButtons() {
        const { fromScratchChecked, copyBaselineChecked, copySystemChecked } = this.state;

        return (<React.Fragment>
            <Radio
                isChecked={ fromScratchChecked }
                id='create baseline'
                name='baseline-create-options'
                label='Create baseline from scratch'
                value='fromScratchChecked'
                onChange={ this.handleChecked }
            />
            <Radio
                isChecked={ copyBaselineChecked }
                id='copy baseline'
                name='baseline-create-options'
                label='Copy an existing baseline'
                value='copyBaselineChecked'
                onChange={ this.handleChecked }
            />
            <Radio
                isChecked={ copySystemChecked }
                id='copy system'
                name='baseline-create-options'
                label='Copy an existing system'
                value='copySystemChecked'
                onChange={ this.handleChecked }
            />
        </React.Fragment>
        );
    }

    renderCopyBaseline() {
        return (<React.Fragment>
            <b>Select baseline to copy from</b>
            <BaselinesTable hasSelect={ true } isModal={ true } isBaselineSelected={ this.isBaselineSelected }/>
        </React.Fragment>
        );
    }

    renderCopySystem() {
        return (<React.Fragment>
            <b>Select system to copy from</b>
            <SystemsTable selectedSystemIds={ [] } createBaselineModal={ true } />
        </React.Fragment>
        );
    }

    checkKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.state.baselineName ? this.submitBaselineName() : null;
        }
    }

    renderModalBody = () => {
        const { baselineName, copyBaselineChecked, copySystemChecked } = this.state;
        const { error } = this.props;
        let modalBody;

        if (copyBaselineChecked) {
            modalBody = this.renderCopyBaseline();
        } else if (copySystemChecked) {
            modalBody = this.renderCopySystem();
        }

        return (<React.Fragment>
            { this.renderRadioButtons() }
            <br></br>
            <b>Baseline name</b>
            <br></br>
            <Form>
                <FormGroup
                    type="text"
                    helperTextInvalid={ error.hasOwnProperty('detail') ? error.detail : null }
                    fieldId="name"
                    isValid={ !error.hasOwnProperty('status') }
                    onKeyPress={ this.checkKeyPress }
                >
                    <TextInput
                        className="fact-value"
                        placeholder="Baseline name"
                        value={ baselineName }
                        type="text"
                        onChange={ this.updateBaselineName }
                        isValid={ !error.hasOwnProperty('status') }
                        aria-label="baseline name"
                    />
                </FormGroup>
            </Form>
            <br></br>
            <br></br>
            { modalBody }
        </React.Fragment>
        );
    }

    renderActions() {
        const { entities } = this.props;
        const { baselineName, copyBaselineChecked, copySystemChecked, selectedBaseline } = this.state;
        let actions;

        if (baselineName === ''
            || (copyBaselineChecked && selectedBaseline.length === 0)
            || (copySystemChecked && entities && entities.selectedSystemIds !== undefined && entities.selectedSystemIds.length === 0)
        ) {
            actions = [
                <Button
                    key="confirm"
                    variant="primary"
                    isDisabled>
                    Create baseline
                </Button>,
                <Button
                    key="cancel"
                    variant="secondary"
                    onClick={ this.cancelModal }>
                    Cancel
                </Button>
            ];
        } else {
            actions = [
                <Button
                    key="confirm"
                    variant="primary"
                    onClick={ this.submitBaselineName }>
                    Create baseline
                </Button>,
                <Button
                    key="cancel"
                    variant="secondary"
                    onClick={ this.cancelModal }>
                    Cancel
                </Button>
            ];
        }

        return actions;
    }

    render() {
        const { modalOpened } = this.props;

        return (
            <Modal
                className="create-baseline-modal"
                title="Create baseline"
                isOpen={ modalOpened }
                onClose={ this.cancelModal }
                width="auto"
                isFooterLeftAligned
                actions={ this.renderActions() }
            >
                { this.renderModalBody() }
            </Modal>
        );
    }
}

CreateBaselineModal.propTypes = {
    toggleModal: PropTypes.func,
    modalOpened: PropTypes.bool,
    createBaseline: PropTypes.func,
    history: PropTypes.object,
    baselineData: PropTypes.object,
    entities: PropTypes.object,
    error: PropTypes.object
};

function mapStateToProps(state) {
    return {
        baselineData: state.createBaselineModalState.baselineData,
        entities: state.entities,
        error: state.createBaselineModalState.error
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createBaseline: (newBaselineObject, uuid) => dispatch(createBaselineModalActions.createBaseline(newBaselineObject, uuid))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateBaselineModal));
