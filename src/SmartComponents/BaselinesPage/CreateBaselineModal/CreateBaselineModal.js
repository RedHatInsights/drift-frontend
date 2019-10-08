import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Modal, Radio, TextInput } from '@patternfly/react-core';

import SystemsTable from '../../SystemsTable/SystemsTable';
import BaselinesTable from '../../BaselinesTable/BaselinesTable';
import { createBaselineModalActions } from './redux';
import { baselinesTableActions } from '../../BaselinesTable/redux';

class CreateBaselineModal extends Component {
    constructor(props) {
        super(props);

        this.submitBaselineName = this.submitBaselineName.bind(this);

        this.state = {
            baselineName: '',
            fromScratchChecked: true,
            copyBaselineChecked: false,
            copySystemChecked: false
        };

        this.updateBaselineName = value => {
            this.setState({ baselineName: value });
        };

        this.handleChecked = (_, event) => {
            const { value } = event.currentTarget;

            if (value === 'fromScratchChecked') {
                this.props.clearSelectedBaselines();
                this.setState({ fromScratchChecked: true, copyBaselineChecked: false, copySystemChecked: false });
            } else if (value === 'copyBaselineChecked') {
                this.setState({ fromScratchChecked: false, copyBaselineChecked: true, copySystemChecked: false });
            } else {
                this.props.clearSelectedBaselines();
                this.setState({ fromScratchChecked: false, copyBaselineChecked: false, copySystemChecked: true });
            }
        };
    }

    async submitBaselineName() {
        const { baselineName, fromScratchChecked } = this.state;
        const { createBaseline, toggleCreateBaselineModal, selectedBaselineIds, history, entities } = this.props;
        /*eslint-disable camelcase*/
        let newBaselineObject = { display_name: baselineName };

        if (fromScratchChecked) {
            newBaselineObject.baseline_facts = [];
            await createBaseline(newBaselineObject);
        } else if (selectedBaselineIds.length === 1) {
            newBaselineObject = { display_name: baselineName };
            await createBaseline(newBaselineObject, selectedBaselineIds[0]);
        } else if (entities.selectedSystemIds.length === 1) {
            newBaselineObject.inventory_uuid = entities.selectedSystemIds[0];
            await createBaseline(newBaselineObject);
        }
        /*eslint-enable camelcase*/

        history.push('baselines/' + this.props.baselineData.id);
        toggleCreateBaselineModal();
    }

    cancelModal = () => {
        const { toggleCreateBaselineModal } = this.props;

        this.updateBaselineName('');
        toggleCreateBaselineModal();
    }

    renderRadioButtons() {
        const { fromScratchChecked, copyBaselineChecked, copySystemChecked } = this.state;

        return (<React.Fragment>
            <Radio
                isChecked={ fromScratchChecked }
                id='create baseline'
                label='Create baseline from scratch'
                value='fromScratchChecked'
                onChange={ this.handleChecked }
            />
            <Radio
                isChecked={ copyBaselineChecked }
                id='copy baseline'
                label='Copy an existing baseline'
                value='copyBaselineChecked'
                onChange={ this.handleChecked }
            />
            <Radio
                isChecked={ copySystemChecked }
                id='copy system'
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
            <BaselinesTable createBaselineModal='true' />
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

    renderModalBody = () => {
        const { baselineName, copyBaselineChecked, copySystemChecked } = this.state;
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
            <TextInput
                className="fact-value"
                value={ baselineName }
                type="text"
                placeholder="Baseline name"
                onChange={ this.updateBaselineName }
                isValid={ baselineName !== '' ? true : false }
                aria-label="baseline name"
            />
            <br></br>
            <br></br>
            { modalBody }
        </React.Fragment>
        );
    }

    render() {
        const { createBaselineModalOpened } = this.props;

        return (
            <Modal
                className="create-baseline-modal"
                title="Create baseline"
                isOpen={ createBaselineModalOpened }
                onClose={ this.cancelModal }
                width="auto"
                actions={ [
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
                ] }
            >
                { this.renderModalBody() }
            </Modal>
        );
    }
}

CreateBaselineModal.propTypes = {
    createBaselineModalOpened: PropTypes.bool,
    createBaseline: PropTypes.func,
    history: PropTypes.obj,
    baselineData: PropTypes.obj,
    toggleCreateBaselineModal: PropTypes.func,
    clearSelectedBaselines: PropTypes.func,
    entities: PropTypes.object,
    selectedBaselineIds: PropTypes.array
};

function mapStateToProps(state) {
    return {
        createBaselineModalOpened: state.createBaselineModalState.createBaselineModalOpened,
        baselineData: state.baselinesTableState.baselineData,
        entities: state.entities,
        selectedBaselineIds: state.baselinesTableState.selectedBaselineIds
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateBaselineModal: () => dispatch(createBaselineModalActions.toggleCreateBaselineModal()),
        createBaseline: (newBaselineObject, uuid) => dispatch(baselinesTableActions.createBaseline(newBaselineObject, uuid)),
        clearSelectedBaselines: () => dispatch(baselinesTableActions.clearSelectedBaselines())
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateBaselineModal));
