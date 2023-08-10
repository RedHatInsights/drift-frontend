import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Radio, TextInput, Form, FormGroup, ValidatedOptions } from '@patternfly/react-core';
import { sortable, cellWidth } from '@patternfly/react-table';
import { addNewListener } from '../../../store';

import SystemsTable from '../../SystemsTable/SystemsTable';
import BaselinesTable from '../../BaselinesTable/BaselinesTable';
import GlobalFilterAlert from '../../GlobalFilterAlert/GlobalFilterAlert';
import { createBaselineModalActions } from './redux';
import { baselinesTableActions } from '../../BaselinesTable/redux';
import systemsTableActions from '../../SystemsTable/actions';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

const CreateBaselineModal = ({ middlewareListener, permissions }) => {
    const dispatch = useDispatch();
    const navigate = useInsightsNavigate();
    const [ baselineName, setBaselineName ] = useState('');
    const [ fromScratchChecked, setFromScratchChecked ] = useState(true);
    const [ copyBaselineChecked, setCopyBaselineChecked ] = useState(false);
    const [ copySystemChecked, setCopySystemChecked ] = useState(false);
    const columns = [
        { title: 'Name', transforms: [ sortable, cellWidth(60) ]},
        { title: 'Last updated', transforms: [ sortable, cellWidth(20) ]},
        { title: 'Associated systems', transforms: [ cellWidth(20) ]}
    ];

    const createBaselineModalOpened = useSelector(({ createBaselineModalState }) => createBaselineModalState.createBaselineModalOpened);
    const baselineData = useSelector(({ createBaselineModalState }) => createBaselineModalState.baselineData);
    const entities = useSelector(({ entities }) => entities);
    const selectedBaselineIds = useSelector(({ baselinesTableState }) => baselinesTableState.radioTable.selectedBaselineIds);
    const createBaselineError = useSelector(({ createBaselineModalState }) => createBaselineModalState.createBaselineError);
    const loading = useSelector(({ baselinesTableState }) => baselinesTableState.radioTable.loading);
    const emptyState = useSelector(({ baselinesTableState }) => baselinesTableState.radioTable.emptyState);
    const baselineTableData = useSelector(({ baselinesTableState }) => baselinesTableState.radioTable.baselineTableData);
    const totalBaselines = useSelector(({ baselinesTableState }) => baselinesTableState.radioTable.totalBaselines);
    const globalFilterState = useSelector(({ globalFilterState }) => globalFilterState);
    const baselineError = useSelector(({ baselinesTableState }) => baselinesTableState.radioTable.baselineError);

    const deselectHistoricalProfiles = async () => {
        await dispatch(systemsTableActions.updateColumns('display_name'));
        dispatch(systemsTableActions.selectSingleHSP());
    };

    useEffect(() => {
        if (middlewareListener) {
            window.entityListener = addNewListener(middlewareListener, {
                actionType: 'SELECT_ENTITY',
                callback: () => {
                    createBaselineModalOpened ? deselectHistoricalProfiles() : null;
                }
            });

            window.entityListener = addNewListener(middlewareListener, {
                actionType: 'SELECT_SINGLE_HSP',
                callback: () => {
                    dispatch(systemsTableActions.updateColumns('display_selected_hsp'));
                }
            });
        }

        return () => {
            window.removeEventListener('SELECT_ENTITY', deselectHistoricalProfiles);
            window.removeEventListener('SELECT_SINGLE_HSP', systemsTableActions.updateColumns);
        };
    }, []);

    useEffect(() => {
        if (baselineData?.id) {
            navigate(`/baselines/${baselineData.id}`);
        }
    }, [ baselineData ]);

    const cancelModal = () => {
        setBaselineName('');
        dispatch(baselinesTableActions.clearSelectedBaselines('RADIO'));
        dispatch(systemsTableActions.selectSingleHSP());
        dispatch(createBaselineModalActions.toggleCreateBaselineModal());
    };

    const onSelect = (event, isSelected, rowId) => {
        let id = [ baselineTableData[rowId][0] ];
        dispatch(baselinesTableActions.selectBaseline(id, isSelected, 'RADIO'));
    };

    const findSelectedRadio = () => {
        const radioChecked = { copyBaselineChecked, copySystemChecked, fromScratchChecked };
        let keys = Object.keys(radioChecked);
        let selectedKey;

        keys.forEach(function(key) {
            if (radioChecked[key]) {
                selectedKey = key.substring(0, key.length - 7).toLowerCase();
            }
        });

        return selectedKey;
    };

    const submitBaselineName = async () => {
        /*eslint-disable camelcase*/
        let newBaselineObject = { display_name: baselineName };

        try {
            if (baselineName !== '') {
                if (fromScratchChecked) {
                    newBaselineObject.baseline_facts = [];
                    await dispatch(createBaselineModalActions.createBaseline(newBaselineObject));
                } else if (selectedBaselineIds.length === 1 && copyBaselineChecked) {
                    newBaselineObject = { display_name: baselineName };
                    await dispatch(createBaselineModalActions.createBaseline(newBaselineObject, selectedBaselineIds[0]));
                } else if (entities?.selectedSystemIds.length && copySystemChecked) {
                    newBaselineObject.inventory_uuid = entities?.selectedSystemIds[0];
                    await dispatch(createBaselineModalActions.createBaseline(newBaselineObject));
                } else if (entities?.selectedHSP && copySystemChecked) {
                    newBaselineObject.hsp_uuid = entities.selectedHSP.id;
                    await dispatch(createBaselineModalActions.createBaseline(newBaselineObject));
                }

                dispatch(createBaselineModalActions.toggleCreateBaselineModal());
                dispatch(createBaselineModalActions.selectSingleHSP());
                dispatch(baselinesTableActions.clearSelectedBaselines('RADIO'));
            }
        } catch (e) {
            // do nothing and let redux handle
        }
        /*eslint-enable camelcase*/
    };

    const handleChecked = (_, event) => {
        const value = event.currentTarget.value;
        dispatch(baselinesTableActions.clearSelectedBaselines('RADIO'));

        if (value === 'fromScratchChecked') {
            setFromScratchChecked(true);
            setCopyBaselineChecked(false);
            setCopySystemChecked(false);
        } else if (value === 'copyBaselineChecked') {
            setFromScratchChecked(false);
            setCopyBaselineChecked(true);
            setCopySystemChecked(false);
        } else {
            setFromScratchChecked(false);
            setCopyBaselineChecked(false);
            setCopySystemChecked(true);
        }
    };

    const renderRadioButtons = () => {
        return (<React.Fragment>
            <Radio
                isChecked={ fromScratchChecked }
                id='create-baseline'
                data-testid='from-scratch-radio'
                ouiaId='create-baseline-from-scratch-radio'
                name='baseline-create-options'
                label='Create baseline from scratch'
                value='fromScratchChecked'
                onChange={ handleChecked }
            />
            <Radio
                isChecked={ copyBaselineChecked }
                id='copy-baseline'
                ouiaId='create-baseline-copy-baseline-radio'
                data-testid='copy-baseline-radio'
                name='baseline-create-options'
                label='Copy an existing baseline'
                value='copyBaselineChecked'
                onChange={ handleChecked }
            />
            <Radio
                isChecked={ copySystemChecked }
                id='copy-system'
                ouiaId='create-baseline-copy-system-radio'
                data-testid='copy-system-radio'
                name='baseline-create-options'
                label='Copy an existing system or historical profile'
                value='copySystemChecked'
                onChange={ handleChecked }
            />
        </React.Fragment>
        );
    };

    const renderActions = () => {
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
                    ouiaId={ `create-baseline-button-${findSelectedRadio()}` }
                    aria-label='create-baseline-disabled'
                >
                    Create baseline
                </Button>,
                <Button
                    key="cancel"
                    variant="link"
                    onClick={ () => cancelModal() }
                    ouiaId="create-baseline-modal-cancel-button"
                    aria-label='cancel-create-baseline'
                >
                    Cancel
                </Button>
            ];
        } else {
            actions = [
                <Button
                    key="confirm"
                    variant="primary"
                    onClick={ () => submitBaselineName() }
                    ouiaId={ `create-baseline-button-${findSelectedRadio()}` }
                    aria-label='create-baseline-confirm'
                >
                    Create baseline
                </Button>,
                <Button
                    key="cancel"
                    variant="link"
                    onClick={ () => cancelModal() }
                    ouiaId="create-baseline-modal-cancel-button"
                    aria-label='cancel-create-baseline'
                >
                    Cancel
                </Button>
            ];
        }

        return actions;
    };

    const buildSystemColumns = (originalColumns) => {
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

    const renderCopySystem = () => {
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
                systemColumns={ buildSystemColumns }
                deselectHistoricalProfiles={ deselectHistoricalProfiles }
            />
        </React.Fragment>
        );
    };

    const renderCopyBaseline = () => {
        return (<React.Fragment>
            <b>Select baseline to copy from</b>
            <BaselinesTable
                tableId='RADIO'
                onSelect={ onSelect }
                tableData={ baselineTableData }
                loading={ loading }
                columns={ columns }
                totalBaselines={ totalBaselines }
                permissions={ permissions }
                hasMultiSelect={ false }
                selectedBaselineIds={ selectedBaselineIds }
                leftAlignToolbar={ true }
                hasSwitch={ false }
                revertBaselineFetch={ baselinesTableActions.revertBaselineFetch }
                baselineError={ baselineError }
                emptyState={ emptyState }
            />
        </React.Fragment>
        );
    };

    const checkKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            baselineName ? submitBaselineName() : null;
        }
    };

    const renderModalBody = () => {
        let modalBody;

        if (copyBaselineChecked) {
            modalBody = renderCopyBaseline();
        } else if (copySystemChecked) {
            modalBody = renderCopySystem();
        }

        return (<React.Fragment>
            { renderRadioButtons() }
            <div className='md-padding-top md-padding-bottom'>
                <Form>
                    <FormGroup
                        label='Baseline name'
                        isRequired
                        type="text"
                        helperTextInvalid={ Object.prototype.hasOwnProperty.call(createBaselineError, 'detail') ? createBaselineError.detail : null }
                        fieldId="name"
                        validated={ Object.prototype.hasOwnProperty.call(createBaselineError, 'status') ? 'error' : null }
                        onKeyPress={ checkKeyPress }
                    >
                        <TextInput
                            className="fact-value"
                            value={ baselineName }
                            type="text"
                            onChange={ (value) => setBaselineName(value) }
                            validated={ Object.prototype.hasOwnProperty.call(createBaselineError, 'status') ? ValidatedOptions.error : null }
                            aria-label="baseline name"
                        />
                    </FormGroup>
                </Form>
            </div>
            { modalBody }
        </React.Fragment>
        );
    };

    return (
        <Modal
            className="drift create-baseline-modal"
            aria-label='create-baseline-modal'
            width="1200px"
            title="Create baseline"
            isOpen={ createBaselineModalOpened }
            onClose={ cancelModal }
            actions={ renderActions() }
        >
            { copySystemChecked
                ? <GlobalFilterAlert globalFilterState={ globalFilterState }/>
                : null
            }
            { renderModalBody() }
        </Modal>
    );
};

CreateBaselineModal.propTypes = {
    middlewareListener: PropTypes.object,
    permissions: PropTypes.object
};

export default CreateBaselineModal;
