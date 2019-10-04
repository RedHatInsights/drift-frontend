import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Modal, TextInput } from '@patternfly/react-core';

import { createBaselineModalActions } from './redux';
import { baselinesTableActions } from '../../BaselinesTable/redux';

class CreateBaselineModal extends Component {
    constructor(props) {
        super(props);

        this.submitBaselineName = this.submitBaselineName.bind(this);

        this.state = {
            baselineName: ''
        };

        this.updateBaselineName = value => {
            this.setState({ baselineName: value });
        };
    }

    async submitBaselineName() {
        const { baselineName } = this.state;
        const { createBaseline, toggleCreateBaselineModal } = this.props;
        /*eslint-disable camelcase*/
        let newBaselineObject = { display_name: baselineName, baseline_facts: []};
        /*eslint-enable camelcase*/

        await createBaseline(newBaselineObject);
        this.props.history.push('baselines/' + this.props.baselineData.id);
        toggleCreateBaselineModal();
    }

    cancelModal = () => {
        const { toggleCreateBaselineModal } = this.props;

        this.updateBaselineName('');
        toggleCreateBaselineModal();
    }

    renderModalBody() {
        const { baselineName } = this.state;

        return (<React.Fragment>
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
        </React.Fragment>
        );
    }

    render() {
        const { createBaselineModalOpened } = this.props;

        return (
            <Modal
                className="small-modal-body"
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
    toggleCreateBaselineModal: PropTypes.func
};

function mapStateToProps(state) {
    return {
        createBaselineModalOpened: state.createBaselineModalState.createBaselineModalOpened,
        baselineData: state.baselinesTableState.baselineData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateBaselineModal: () => dispatch(createBaselineModalActions.toggleCreateBaselineModal()),
        createBaseline: (newBaselineObject) => dispatch(baselinesTableActions.createBaseline(newBaselineObject))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateBaselineModal));
