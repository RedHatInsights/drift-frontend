import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, InputGroup, TextInput, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { Table, TableBody, TableHeader, RowWrapper, ExpandableRowContent } from '@patternfly/react-table';
import {
    editableTableBody,
    editableRowWrapper,
    inlineEditFormatterFactory,
    TableEditConfirmation,
    TableTextInput
} from '@patternfly/react-inline-edit-extension';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { AddCircleOIcon, EditIcon } from '@patternfly/react-icons';

import { baselinesPageActions } from '../redux';
import { baselinesTableActions } from '../../BaselinesTable/redux';
import editBaselineHelpers from './helpers';

function renderRows(baselineData) {
    let newRows = [];
    let counter = 0;

    if (!baselineData) {
        newRows = [];
    } else {
        baselineData.baseline_facts.forEach(function(fact) {
            let row = [];
            let parentCounter = counter;
            row.push(fact.name);
            if (fact.values) {
                row.push('');
                newRows.push({
                    cells: row, isOpen: false
                });

                fact.values.forEach(function(fact) {
                    let subFacts = [];
                    counter++;
                    subFacts.push(fact.name);
                    subFacts.push(fact.value);

                    newRows.push({
                        cells: [ null ], data: { modules: subFacts }, parent: parentCounter
                    });
                });

                counter++;
            } else {
                row.push(fact.value);

                newRows.push({
                    cells: row, isOpen: false
                });
                counter++;
            }
        });
    }

    return newRows;
}

class EditBaseline extends Component {
    constructor(props) {
        super(props);
        this.finishBaselineEdit = this.finishBaselineEdit.bind(this);
        this.addFact = this.addFact.bind(this);
        this.renderAddNewFact = this.renderAddNewFact.bind(this);
        this.renderEditBaselineName = this.renderEditBaselineName.bind(this);

        this.props.fetchBaselineData(this.props.baselineUUID);

        this.makeId = ({ column, rowIndex, columnIndex, name }) =>
            `${column.property}-${rowIndex}-${columnIndex}${name ? `-${name}` : ''}`;

        const childEditRenderer = (value, { column, rowIndex, rowData, columnIndex, activeEditId }) => (
            <ExpandableRowContent>
                { rowData.data.modules.map((module, idx) => {
                    const inlineStyle = {
                        marginLeft: idx && '1em',
                        display: 'inline-block',
                        width: '48%'
                    };

                    const id = this.makeId({ rowIndex, columnIndex, column, name: `module-${idx}` });

                    return (
                        <TableTextInput
                            id={ id }
                            key={ id }
                            defaultValue={ module }
                            style={ inlineStyle }
                            onBlur={ newValue =>
                                this.onChange(newValue, {
                                    rowIndex,
                                    moduleIndex: idx
                                })
                            }
                            autoFocus={ activeEditId === id }
                        />
                    );
                }) }
            </ExpandableRowContent>
        );

        const parentEditRenderer = (value, { column, rowIndex, columnIndex, activeEditId }) => {
            const id = this.makeId({ rowIndex, columnIndex, column, name: 'parent-repo' });
            return (
                <TableTextInput
                    id={ id }
                    key={ id }
                    defaultValue={ value }
                    onBlur={ newValue =>
                        this.onChange(newValue, {
                            rowIndex,
                            columnIndex
                        })
                    }
                    autoFocus={ activeEditId === id }
                />
            );
        };

        const textInputFormatter = inlineEditFormatterFactory({
            renderValue: (value, { rowData }) =>
                rowData.hasOwnProperty('parent') ? (
                    <ExpandableRowContent>{ rowData.data.modules.filter(a => a).join(', ') }</ExpandableRowContent>
                ) : (
                    value
                ),
            renderEdit: (value, { column, columnIndex, rowIndex, rowData }, { activeEditId }) => {
                const renderer = rowData.hasOwnProperty('parent') ? childEditRenderer : parentEditRenderer;
                return renderer(value, { rowData, column, rowIndex, columnIndex, activeEditId });
            }
        });

        let rows = [ ...new Array(5) ].map(() =>
            [ ...new Array(2) ].map((index) =>
                <Skeleton key={ index } size={ SkeletonSize.md } />
            )
        );

        let displayName;

        if (this.props.baselineData) {
            displayName = this.props.baselineData.display_name;
        } else {
            displayName = '';
        }

        this.state = {
            loadingColumns: [ 'Fact', 'Value' ],
            columns: [
                {
                    title: 'Fact',
                    cellFormatters: [ textInputFormatter ]
                },
                {
                    title: 'Value',
                    cellFormatters: [ textInputFormatter ]
                }
            ],
            rows,
            editedRowsBackup: null,
            activeEditId: null,
            baselineName: displayName,
            factName: '',
            valueName: '',
            showAddNewFact: false,
            showAddNewParentFact: false,
            parentRowId: undefined,
            isEditingBaselineName: false
        };

        this.changeFactName = value => {
            this.setState({ factName: value });
        };

        this.changeValueName = value => {
            this.setState({ valueName: value });
        };

        this.submitBaselineName = () => {
            const { patchBaseline, baselineData } = this.props;
            /*eslint-disable camelcase*/
            let apiBody = { display_name: document.getElementById('newBaselineName').value, facts_patch: []};
            /*eslint-enable camelcase*/

            patchBaseline(baselineData.id, apiBody);
            this.clearFactAndValueData();
            this.toggleIsEditingBaselineName();
        };

        this.onChange = (value, { rowIndex, columnIndex, moduleIndex }) => {
            this.setState(({ rows }) => {
                const { baselineData, patchBaseline } = this.props;
                rows = [ ...rows ];
                const row = rows[rowIndex];
                if (moduleIndex !== null && moduleIndex !== undefined) {
                    row.data.modules[moduleIndex] = value;
                } else {
                    const shiftedColumnIndex = columnIndex - 1; // to take Expandable Column into account;
                    row.cells[shiftedColumnIndex] = value;
                }

                let apiBody = this.buildEditFactBody(rows, rowIndex);
                let patch = editBaselineHelpers.makeAPIPatch(apiBody, baselineData);
                patchBaseline(baselineData.id, patch);

                return { rows, activeEditId: null };
            });
        };

        this.buildEditFactBody = (rows, rowIndex) => {
            let row = rows[rowIndex];
            let apiBody = {};

            if (row.parent || row.parent === 0) {
                let childRows = editBaselineHelpers.buildParentFact(rows, row.parent);

                apiBody.name = rows[row.parent].cells[0];
                apiBody.values = childRows;
            } else {
                apiBody.name = row.cells[0];
                apiBody.value = row.cells[1];
            }

            return apiBody;
        };

        this.onEditCellClicked = (event, clickedRow, { rowIndex, columnIndex, elementId }) => {
            const EXPANDABLE_COL = 0;
            const ACTIONS_COL = 4;

            if (elementId !== this.state.activeEditId && clickedRow.isEditing && columnIndex !== ACTIONS_COL) {
                this.setState(({ rows }) => ({
                    activeEditId: elementId,
                    rows: rows.map((row, id) => {
                        if (id === rowIndex && columnIndex === EXPANDABLE_COL && row.hasOwnProperty('isOpen')) {
                            row.isOpen = !row.isOpen;
                        }

                        return row;
                    })
                }));
            }
        };

        this.getParentId = (rowId, rows) => (rows[rowId].parent === undefined ? rowId : rows[rowId].parent);
        this.getChildId = (rowId, rows) =>
            rows[rowId].parent === undefined
                ? rows.map((row, idx) => (row.parent === rowId ? idx : null)).find(idx => idx !== null)
                : rowId;

        this.onEditActionClick = (event, rowId) => {
            this.setState(({ rows, editedRowBackup }) => {
                if (!editedRowBackup) {
                    let backup = {
                        [rowId]: rows[rowId]
                    };

                    return {
                        editedRowsBackup: JSON.parse(JSON.stringify(backup)),
                        rows: rows.map((row, id) => {
                            row.isEditing = !!backup[id];
                            return row;
                        })
                    };
                }

                return undefined;
            });
        };

        this.onEditConfirmed = () => {
            this.setState(({ rows, editedRowsBackup }) => {
                rows = [ ...rows ];
                Object.keys(editedRowsBackup).forEach(key => {
                    rows[key].isEditing = false;
                });

                return {
                    rows,
                    editedRowsBackup: null,
                    activeEditId: null
                };
            });
        };

        this.onEditCanceled = () => {
            this.setState(({ rows, editedRowsBackup }) => {
                rows = [ ...rows ];
                Object.keys(editedRowsBackup).forEach(key => {
                    rows[key] = editedRowsBackup[key];
                });

                return {
                    rows,
                    editedRowsBackup: null,
                    activeEditId: null
                };
            });
        };

        this.onCollapse = (event, rowKey, isOpen) => {
            const { rows } = this.state;
            rows[rowKey].isOpen = isOpen;
            this.setState({
                rows
            });
        };

        this.onNewFactActionClick = (event, rowId) => {
            this.setState({
                parentRowId: rowId,
                showAddNewFact: true
            });
        };

        this.actionResolver = rowData =>
            rowData.isTableEditing
                ? null
                : rowData.cells[1] === ''
                    ? [
                        {
                            title: 'Add fact',
                            onClick: this.onNewFactActionClick
                        }
                    ]
                    : [
                        {
                            title: 'Edit',
                            onClick: this.onEditActionClick
                        }
                    ];

        this.toggleNewFact = () => {
            const { showAddNewFact } = this.state;
            this.setState({
                showAddNewFact: !showAddNewFact,
                factName: '',
                valueName: ''
            });
        };

        this.toggleNewParentFact = () => {
            const { showAddNewParentFact } = this.state;
            this.setState({
                showAddNewParentFact: !showAddNewParentFact,
                factName: ''
            });
        };

        this.clearFactAndValueData = () => {
            this.setState({
                factName: '',
                valueName: '',
                showAddNewFact: false,
                showAddNewParentFact: false,
                parentRowId: undefined
            });
        };

        this.toggleIsEditingBaselineName = () => {
            const { isEditingBaselineName } = this.state;

            this.setState({
                isEditingBaselineName: !isEditingBaselineName
            });
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.baselineData && (props.baselineDataLoading !== state.baselineDataLoading)) {
            return {
                rows: renderRows(props.baselineData),
                baselineName: props.baselineData.display_name,
                baselineDataLoading: props.baselineDataLoading
            };
        }
    }

    finishBaselineEdit() {
        const { clearBaselineData } = this.props;

        clearBaselineData();
    }

    renderAddNewFact() {
        const { showAddNewFact, showAddNewParentFact } = this.state;
        let newFactToolbar;

        if (!showAddNewFact && !showAddNewParentFact) {
            newFactToolbar = <Toolbar className='display-margin'>
                <ToolbarGroup>
                    <ToolbarItem>
                        <Button
                            variant='primary'
                            onClick={ this.toggleNewParentFact }>
                            <AddCircleOIcon />
                            Add Parent Fact
                        </Button>
                    </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarItem>
                        <Button
                            variant='primary'
                            onClick={ this.toggleNewFact }>
                            <AddCircleOIcon />
                            Add Fact
                        </Button>
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>;
        } else {
            newFactToolbar = <React.Fragment>
                <Toolbar className='display-margin'>
                    <InputGroup>
                        <TextInput
                            id="newFactName"
                            type="text"
                            placeholder="Fact"
                            aria-label="fact name"/>
                        { showAddNewFact
                            ? <TextInput
                                id="newFactValue"
                                type="text"
                                placeholder="Value"
                                aria-label="value name"/>
                            : null
                        }
                        <Button
                            variant='primary'
                            onClick={ this.addFact }>
                            Submit
                        </Button>
                        { showAddNewFact
                            ? <Button
                                variant='danger'
                                onClick={ this.toggleNewFact }>
                                Cancel
                            </Button>
                            : <Button
                                variant='danger'
                                onClick={ this.toggleNewParentFact }>
                                Cancel
                            </Button>
                        }
                    </InputGroup>
                </Toolbar>
            </React.Fragment>;
        }

        return newFactToolbar;
    }

    addFact() {
        const { parentRowId, rows } = this.state;
        const { baselineData, patchBaseline } = this.props;
        let name = document.getElementById('newFactName').value;
        let newFactValue = document.getElementById('newFactValue');
        let newFact = {};

        /*eslint-disable camelcase*/
        if (newFactValue !== null) {
            newFact.name = name;
            newFact.value = newFactValue.value;
            if (parentRowId || parentRowId === 0) {
                let childRows = editBaselineHelpers.buildParentFact(rows, parentRowId);
                childRows.push(newFact);
                newFact = {};
                newFact.name = rows[parentRowId].cells[0];
                newFact.values = childRows;
            }
        } else {
            newFact.name = name;
            newFact.values = [];
        }

        let patch = editBaselineHelpers.makeAPIPatch(newFact, baselineData);
        /*eslint-enable camelcase*/

        patchBaseline(baselineData.id, patch);
        this.clearFactAndValueData();
    }

    renderEditBaselineName() {
        const { isEditingBaselineName, baselineName } = this.state;
        let baselineNameEdit;

        if (isEditingBaselineName) {
            baselineNameEdit = <Toolbar className='display-margin'>
                <InputGroup>
                    <TextInput
                        id="newBaselineName"
                        type="text"
                        aria-label="baseline name"
                    />
                    <Button onClick={ this.submitBaselineName }>Submit</Button>
                    <Button variant='danger' onClick={ this.toggleIsEditingBaselineName }>Cancel</Button>
                </InputGroup>
            </Toolbar>;
        } else {
            baselineNameEdit = <div className='display-margin'>
                { baselineName } <EditIcon className='not-active' onClick={ this.toggleIsEditingBaselineName } />
            </div>;
        }

        return baselineNameEdit;
    }

    render() {
        const { activeEditId, loadingColumns, columns, rows } = this.state;
        const { baselineData } = this.props;
        const editConfig = {
            activeEditId,
            onEditCellClicked: this.onEditCellClicked,
            editConfirmationType: TableEditConfirmation.ROW,
            onEditConfirmed: this.onEditConfirmed,
            onEditCanceled: this.onEditCanceled
        };
        const ComposedBody = editableTableBody(TableBody);
        const ComposedRowWrapper = editableRowWrapper(RowWrapper);

        return (
            <React.Fragment>
                { this.renderEditBaselineName() }
                { baselineData
                    ? <Table
                        cells={ columns }
                        rows={ rows }
                        rowWrapper={ ComposedRowWrapper }
                        onCollapse={ this.onCollapse }
                        actionResolver={ this.actionResolver }
                    >
                        <TableHeader />
                        <ComposedBody editConfig={ editConfig } />
                    </Table>
                    : <Table
                        cells={ loadingColumns }
                        rows={ rows }
                    >
                        <TableHeader />
                        <TableBody />
                    </Table>
                }
                <br></br>
                { this.renderAddNewFact() }
                <Button
                    className="button-margin margin-right"
                    style={ { float: 'right' } }
                    variant='primary'
                    onClick={ this.finishBaselineEdit }>
                    Finish
                </Button>
            </React.Fragment>
        );
    }
}

EditBaseline.propTypes = {
    toggleCreateBaseline: PropTypes.func,
    clearBaselineData: PropTypes.func,
    baselineUUID: PropTypes.string,
    baselineData: PropTypes.object,
    baselineDataLoading: PropTypes.bool,
    patchBaseline: PropTypes.func,
    fetchBaselineData: PropTypes.func
};

function mapStateToProps(state) {
    return {
        baselineUUID: state.baselinesTableState.baselineUUID,
        baselineData: state.baselinesTableState.baselineData,
        baselineDataLoading: state.baselinesTableState.baselineDataLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBaselineData: (baselineUUID) => dispatch(baselinesTableActions.fetchBaselineData(baselineUUID)),
        toggleCreateBaseline: () => dispatch(baselinesPageActions.toggleCreateBaseline()),
        clearBaselineData: () => dispatch(baselinesTableActions.clearBaselineData()),
        patchBaseline: (baselineId, newBaselineBody) => dispatch(baselinesTableActions.patchBaseline(baselineId, newBaselineBody))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBaseline);
