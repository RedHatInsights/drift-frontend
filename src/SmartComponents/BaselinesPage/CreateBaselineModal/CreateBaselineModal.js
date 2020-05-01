import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Modal, Radio, TextInput, Form, FormGroup } from '@patternfly/react-core';
import { sortable } from '@patternfly/react-table';

import SystemsTable from '../../SystemsTable/SystemsTable';
import BaselinesTable from '../../BaselinesTable/BaselinesTable';
import { createBaselineModalActions } from './redux';
import { baselinesTableActions } from '../../BaselinesTable/redux';

export class CreateBaselineModal extends Component {
    constructor(props) {
        super(props);

        this.submitBaselineName = this.submitBaselineName.bind(this);

        this.state = {
            baselineName: '',
            fromScratchChecked: true,
            copyBaselineChecked: false,
            copySystemChecked: false,
            columns: [
                { title: '' },
                { title: 'Name', transforms: [ sortable ]},
                { title: 'Last updated', transforms: [ sortable ]}
            ]
        };

        this.updateBaselineName = value => {
            this.setState({ baselineName: value });
        };

        this.handleChecked = (_, event) => {
            const value = event.currentTarget.value;
            this.props.clearSelectedBaselines('RADIO');

            if (value === 'fromScratchChecked') {
                this.setState({ fromScratchChecked: true, copyBaselineChecked: false, copySystemChecked: false });
            } else if (value === 'copyBaselineChecked') {
                this.setState({ fromScratchChecked: false, copyBaselineChecked: true, copySystemChecked: false });
            } else {
                this.setState({ fromScratchChecked: false, copyBaselineChecked: false, copySystemChecked: true });
            }
        };
    }

    async submitBaselineName() {
        const { baselineName, fromScratchChecked, copyBaselineChecked, copySystemChecked } = this.state;
        const { createBaseline, toggleCreateBaselineModal, selectedBaselineIds, history, entities, clearSelectedBaselines } = this.props;
        /*eslint-disable camelcase*/
        let newBaselineObject = { display_name: baselineName };

        try {
            if (baselineName !== '') {
                if (fromScratchChecked) {
                    newBaselineObject.baseline_facts = [];
                    await createBaseline(newBaselineObject);
                } else if (selectedBaselineIds.length === 1 && copyBaselineChecked) {
                    newBaselineObject = { display_name: baselineName };
                    await createBaseline(newBaselineObject, selectedBaselineIds[0]);
                } else if (entities.selectedSystemIds.length === 1 && copySystemChecked) {
                    newBaselineObject.inventory_uuid = entities.selectedSystemIds[0];
                    await createBaseline(newBaselineObject);
                }

                history.push('baselines/' + this.props.baselineData.id);
                toggleCreateBaselineModal();
                clearSelectedBaselines('RADIO');
            }
        } catch (e) {
            // do nothing and let redux handle
        }
        /*eslint-enable camelcase*/
    }

    onSelect = (_, event) => {
        const { selectBaseline } = this.props;

        let id = [ event.currentTarget.id ];
        let isSelected = event.currentTarget.checked;
        selectBaseline(id, isSelected, 'RADIO');
    }

    cancelModal = () => {
        const { toggleCreateBaselineModal, clearSelectedBaselines } = this.props;

        this.updateBaselineName('');
        clearSelectedBaselines('RADIO');
        toggleCreateBaselineModal();
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
        const { baselineTableData, loading, createBaselineModalOpened } = this.props;
        const { columns } = this.state;

        return (<React.Fragment>
            <b>Select baseline to copy from</b>
            <BaselinesTable
                tableId='RADIO'
                onSelect={ this.onSelect }
                tableData={ baselineTableData }
                loading={ loading }
                createBaselineModalOpened={ createBaselineModalOpened }
                columns={ columns }
            />
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
        const { selectedBaselineIds, entities } = this.props;
        const { baselineName, copyBaselineChecked, copySystemChecked } = this.state;
        let actions;

        if (baselineName === ''
            || (copyBaselineChecked && selectedBaselineIds.length === 0)
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
        const { createBaselineModalOpened } = this.props;

        return (
            <Modal
                className="create-baseline-modal"
                title="Create baseline"
                isOpen={ createBaselineModalOpened }
                onClose={ this.cancelModal }
                isFooterLeftAligned
                actions={ this.renderActions() }
            >
                { this.renderModalBody() }
            </Modal>
        );
    }
}

CreateBaselineModal.propTypes = {
    createBaselineModalOpened: PropTypes.bool,
    createBaseline: PropTypes.func,
    selectBaseline: PropTypes.func,
    history: PropTypes.object,
    baselineData: PropTypes.array,
    toggleCreateBaselineModal: PropTypes.func,
    clearSelectedBaselines: PropTypes.func,
    entities: PropTypes.object,
    selectedBaselineIds: PropTypes.array,
    error: PropTypes.object,
    baselineTableData: PropTypes.array,
    loading: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        createBaselineModalOpened: state.createBaselineModalState.createBaselineModalOpened,
        baselineData: state.createBaselineModalState.baselineData,
        entities: state.entities,
        selectedBaselineIds: state.baselinesTableState.radioTable.selectedBaselineIds,
        error: state.createBaselineModalState.error,
        loading: state.baselinesTableState.radioTable.loading,
        emptyState: state.baselinesTableState.radioTable.emptyState,
        baselineTableData: state.baselinesTableState.radioTable.baselineTableData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateBaselineModal: () => dispatch(createBaselineModalActions.toggleCreateBaselineModal()),
        createBaseline: (newBaselineObject, uuid) => dispatch(createBaselineModalActions.createBaseline(newBaselineObject, uuid)),
        selectBaseline: (id, isSelected, tableId) => dispatch(baselinesTableActions.selectBaseline(id, isSelected, tableId)),
        clearSelectedBaselines: (tableId) => dispatch(baselinesTableActions.clearSelectedBaselines(tableId))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateBaselineModal));
