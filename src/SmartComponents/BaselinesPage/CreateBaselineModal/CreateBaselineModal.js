import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Alert, Button, Modal, Radio, TextInput, Form, FormGroup, ValidatedOptions } from '@patternfly/react-core';
import { sortable, cellWidth } from '@patternfly/react-table';
import { addNewListener } from '../../../store';

import SystemsTable from '../../SystemsTable/SystemsTable';
import BaselinesTable from '../../BaselinesTable/BaselinesTable';
import GlobalFilterAlert from '../../GlobalFilterAlert/GlobalFilterAlert';
import { createBaselineModalActions } from './redux';
import { baselinesTableActions } from '../../BaselinesTable/redux';
import systemsTableActions from '../../SystemsTable/actions';

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
                { title: 'Name', transforms: [ sortable ]},
                { title: 'Last updated', transforms: [ sortable, cellWidth(40) ]}
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

    buildSystemColumns = (originalColumns) => {
        const { permissions } = this.props;
        let columns = originalColumns.map(function(column) {
            if (column.key === 'display_name' || column.key === 'display_selected_hsp') {
                return {
                    title: 'Name',
                    key: column.key,
                    props: { width: 20 },
                    renderFunc: (value, _id, { display_selected_hsp: selectedHSP }) => {
                        return selectedHSP || value;
                    }
                };
            } else {
                return column;
            }
        });

        if (permissions.hspRead) {
            columns.push({ key: 'historical_profiles', props: { width: 10, isStatic: true }, title: 'Historical profiles' });
        }

        return columns;
    };

    async componentDidMount() {
        window.entityListener = addNewListener({
            actionType: 'SELECT_ENTITY',
            callback: () => {
                this.props.createBaselineModalOpened ? this.deselectHistoricalProfiles() : null;
            }
        });

        window.entityListener = addNewListener({
            actionType: 'SELECT_SINGLE_HSP',
            callback: () => {
                this.props.updateColumns('display_selected_hsp');
            }
        });
    }

    async componentWillUnmount() {
        window.removeEventListener('SELECT_ENTITY', this.deselectHistoricalProfiles);
        window.removeEventListener('SELECT_SINGLE_HSP', this.props.updateColumns);
    }

    deselectHistoricalProfiles = async () => {
        const { selectSingleHSP, updateColumns } = this.props;

        await updateColumns('display_name');
        selectSingleHSP();
    };

    findSelectedRadio() {
        const { copyBaselineChecked, copySystemChecked, fromScratchChecked } = this.state;
        const radioChecked = { copyBaselineChecked, copySystemChecked, fromScratchChecked };
        let keys = Object.keys(radioChecked);
        let selectedKey;

        keys.forEach(function(key) {
            if (radioChecked[key]) {
                selectedKey = key.substring(0, key.length - 7).toLowerCase();
            }
        });

        return selectedKey;
    }

    async submitBaselineName() {
        const { baselineName, fromScratchChecked, copyBaselineChecked, copySystemChecked } = this.state;
        const { createBaseline, toggleCreateBaselineModal, selectedBaselineIds,
            history, entities, clearSelectedBaselines, selectSingleHSP } = this.props;

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
                } else if (entities?.selectedSystemIds.length && copySystemChecked) {
                    newBaselineObject.inventory_uuid = entities?.selectedSystemIds[0];
                    await createBaseline(newBaselineObject);
                } else if (entities?.selectedHSP && copySystemChecked) {
                    newBaselineObject.hsp_uuid = entities.selectedHSP.id;
                    await createBaseline(newBaselineObject);
                }

                history.push('baselines/' + this.props.baselineData.id);
                toggleCreateBaselineModal();
                selectSingleHSP();
                clearSelectedBaselines('RADIO');
            }
        } catch (e) {
            // do nothing and let redux handle
        }
        /*eslint-enable camelcase*/
    }

    onSelect = (event, isSelected, rowId) => {
        const { baselineTableData, selectBaseline } = this.props;

        let id = [ baselineTableData[rowId][0] ];
        selectBaseline(id, isSelected, 'RADIO');
    }

    cancelModal = () => {
        const { toggleCreateBaselineModal, clearSelectedBaselines, selectSingleHSP } = this.props;

        this.updateBaselineName('');
        clearSelectedBaselines('RADIO');
        selectSingleHSP();
        toggleCreateBaselineModal();
    }

    renderRadioButtons() {
        const { fromScratchChecked, copyBaselineChecked, copySystemChecked } = this.state;

        return (<React.Fragment>
            <Radio
                isChecked={ fromScratchChecked }
                id='create baseline'
                ouiaId='create-baseline-from-scratch-radio'
                name='baseline-create-options'
                label='Create baseline from scratch'
                value='fromScratchChecked'
                onChange={ this.handleChecked }
            />
            <Radio
                isChecked={ copyBaselineChecked }
                id='copy baseline'
                ouiaId='create-baseline-copy-baseline-radio'
                name='baseline-create-options'
                label='Copy an existing baseline'
                value='copyBaselineChecked'
                onChange={ this.handleChecked }
            />
            <Radio
                isChecked={ copySystemChecked }
                id='copy system'
                ouiaId='create-baseline-copy-system-radio'
                name='baseline-create-options'
                label='Copy an existing system or historical profile'
                value='copySystemChecked'
                onChange={ this.handleChecked }
            />
        </React.Fragment>
        );
    }

    renderCopyBaseline() {
        const { baselineTableData, createBaselineModalOpened, loading, permissions, selectedBaselineIds, totalBaselines } = this.props;
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
                totalBaselines={ totalBaselines }
                permissions={ permissions }
                hasMultiSelect={ false }
                selectedBaselineIds={ selectedBaselineIds }
            />
        </React.Fragment>
        );
    }

    renderCopySystem() {
        const { entities, permissions } = this.props;

        return (<React.Fragment>
            <b>Select system or historical profile to copy from</b>
            <br></br>
            <SystemsTable
                createBaselineModal={ true }
                hasMultiSelect={ false }
                historicalProfiles={ entities?.selectedHSP ? [ entities.selectedHSP ] : [] }
                permissions={ permissions }
                entities={ entities }
                selectVariant='radio'
                systemColumns={ this.buildSystemColumns }
                deselectHistoricalProfiles={ this.deselectHistoricalProfiles }
            />
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
        const { createBaselineError } = this.props;
        let modalBody;

        if (copyBaselineChecked) {
            modalBody = this.renderCopyBaseline();
        } else if (copySystemChecked) {
            modalBody = this.renderCopySystem();
        }

        return (<React.Fragment>
            { this.renderRadioButtons() }
            <div className='md-padding-top md-padding-bottom'>
                <Form>
                    <FormGroup
                        label='Baseline name'
                        isRequired
                        type="text"
                        helperTextInvalid={ Object.prototype.hasOwnProperty.call(createBaselineError, 'detail') ? createBaselineError.detail : null }
                        fieldId="name"
                        validated={ Object.prototype.hasOwnProperty.call(createBaselineError, 'status') ? 'error' : null }
                        onKeyPress={ this.checkKeyPress }
                    >
                        <TextInput
                            className="fact-value"
                            value={ baselineName }
                            type="text"
                            onChange={ this.updateBaselineName }
                            validated={ Object.prototype.hasOwnProperty.call(createBaselineError, 'status') ? ValidatedOptions.error : null }
                            aria-label="baseline name"
                        />
                    </FormGroup>
                </Form>
            </div>
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
            || (copySystemChecked &&
                (!entities?.selectedSystemIds.length && !entities?.selectedHSP)
            )
        ) {
            actions = [
                <Button
                    key="confirm"
                    variant="primary"
                    isDisabled
                    ouiaId={ 'create-baseline-button-' + this.findSelectedRadio() }
                >
                    Create baseline
                </Button>,
                <Button
                    key="cancel"
                    variant="link"
                    onClick={ this.cancelModal }
                    ouiaId="create-baseline-modal-cancel-button"
                >
                    Cancel
                </Button>
            ];
        } else {
            actions = [
                <Button
                    key="confirm"
                    variant="primary"
                    onClick={ this.submitBaselineName }
                    ouiaId={ 'create-baseline-button-' + this.findSelectedRadio() }
                >
                    Create baseline
                </Button>,
                <Button
                    key="cancel"
                    variant="link"
                    onClick={ this.cancelModal }
                    ouiaId="create-baseline-modal-cancel-button"
                >
                    Cancel
                </Button>
            ];
        }

        return actions;
    }

    render() {
        const { createBaselineError, createBaselineModalOpened, globalFilterState } = this.props;
        const { copySystemChecked } = this.state;

        return (
            <Modal
                className="drift"
                width="1200px"
                title="Create baseline"
                isOpen={ createBaselineModalOpened }
                onClose={ this.cancelModal }
                actions={ this.renderActions() }
            >
                { copySystemChecked
                    ? <GlobalFilterAlert globalFilterState={ globalFilterState }/>
                    : null
                }
                { createBaselineError.status
                    ? <Alert
                        variant='danger'
                        isInline
                        title={ 'Status: ' + createBaselineError.status }
                        ouiaId="status"
                    >
                        <p>
                            { createBaselineError.detail }
                        </p>
                    </Alert>
                    : <div></div>
                }
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
    baselineData: PropTypes.object,
    toggleCreateBaselineModal: PropTypes.func,
    clearSelectedBaselines: PropTypes.func,
    entities: PropTypes.object,
    selectedBaselineIds: PropTypes.array,
    createBaselineError: PropTypes.object,
    baselineTableData: PropTypes.array,
    loading: PropTypes.bool,
    totalBaselines: PropTypes.number,
    updatePagination: PropTypes.func,
    historicalProfiles: PropTypes.array,
    permissions: PropTypes.object,
    globalFilterState: PropTypes.object,
    selectHistoricProfiles: PropTypes.func,
    setSelectedSystemIds: PropTypes.func,
    selectSingleHSP: PropTypes.func,
    updateColumns: PropTypes.func
};

function mapStateToProps(state) {
    return {
        createBaselineModalOpened: state.createBaselineModalState.createBaselineModalOpened,
        baselineData: state.createBaselineModalState.baselineData,
        entities: state.entities,
        selectedBaselineIds: state.baselinesTableState.radioTable.selectedBaselineIds,
        createBaselineError: state.createBaselineModalState.createBaselineError,
        loading: state.baselinesTableState.radioTable.loading,
        emptyState: state.baselinesTableState.radioTable.emptyState,
        baselineTableData: state.baselinesTableState.radioTable.baselineTableData,
        totalBaselines: state.baselinesTableState.radioTable.totalBaselines,
        historicalProfiles: state.compareState.historicalProfiles,
        globalFilterState: state.globalFilterState
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateBaselineModal: () => dispatch(createBaselineModalActions.toggleCreateBaselineModal()),
        createBaseline: (newBaselineObject, uuid) => dispatch(createBaselineModalActions.createBaseline(newBaselineObject, uuid)),
        selectBaseline: (id, isSelected, tableId) => dispatch(baselinesTableActions.selectBaseline(id, isSelected, tableId)),
        clearSelectedBaselines: (tableId) => dispatch(baselinesTableActions.clearSelectedBaselines(tableId)),
        selectSingleHSP: (profile) => dispatch(systemsTableActions.selectSingleHSP(profile)),
        updateColumns: (key) => dispatch(systemsTableActions.updateColumns(key))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateBaselineModal));
