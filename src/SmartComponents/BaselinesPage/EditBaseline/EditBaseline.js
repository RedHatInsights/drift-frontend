import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, InputGroup, TextInput } from '@patternfly/react-core';
import { Table, TableBody, TableHeader, RowWrapper, ExpandableRowContent } from '@patternfly/react-table';
import {
    editableTableBody,
    editableRowWrapper,
    inlineEditFormatterFactory,
    TableEditConfirmation,
    TableTextInput
} from '@patternfly/react-inline-edit-extension';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

import { baselinesPageActions } from '../redux';
import { baselinesTableActions } from '../../BaselinesTable/redux';
import api from '../../../api.js';

class EditBaseline extends Component {
    constructor(props) {
        super(props);
        this.finishBaselineEdit = this.finishBaselineEdit.bind(this);

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
            columns: [ 'Fact', 'Value' ],
            rows,
            editedRowsBackup: null,
            activeEditId: null,
            baselineName: displayName
        };

        this.changeBaselineName = value => {
            this.setState({ value });
        };

        this.submitBaselineName = (/*baselineName*/) => {
        };

        this.onChange = (value, { rowIndex, columnIndex, moduleIndex }) => {
            this.setState(({ rows }) => {
                const { baselineData } = this.props;
                rows = [ ...rows ];
                const row = rows[rowIndex];
                if (moduleIndex !== null && moduleIndex !== undefined) {
                    row.data.modules[moduleIndex] = value;
                } else {
                    const shiftedColumnIndex = columnIndex - 1; // to take Expandable Column into account;
                    row.cells[shiftedColumnIndex] = value;
                }

                let apiBody = this.buildApiBody(rows, rowIndex);
                api.patchBaselineData(baselineData.id, apiBody);

                return { rows, activeEditId: null };
            });
        };

        this.buildApiBody = (rows, rowIndex) => {
            let row = rows[rowIndex];
            let apiBody = {};
            let baselineFactsArray = [];

            /*eslint-disable camelcase*/
            if (row.parent || row.parent === 0) {
                let parentRow = rows[row.parent];
                let childRows = rows.filter(function(row) {
                    return row.parent === rows[rowIndex].parent;
                })
                .map(function(row) {
                    return { name: row.data.modules[0], value: row.data.modules[1] };
                });

                baselineFactsArray.push({
                    name: parentRow.cells[0],
                    values: childRows
                });

                apiBody.baseline_facts = baselineFactsArray;
            } else {
                baselineFactsArray.push({
                    name: row.cells[0], value: row.cells[1]
                });

                apiBody.baseline_facts = baselineFactsArray;
            }
            /*eslint-enable camelcase*/

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
                    let backup;
                    if (!rows[rowId].parent) {
                        backup = {
                            [rowId]: rows[rowId]
                        };
                    } else {
                        const childId = this.getChildId(rowId, rows);
                        const parentId = this.getParentId(rowId, rows);

                        backup = {
                            [parentId]: rows[parentId],
                            [childId]: rows[childId]
                        };
                    }

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

        this.actionResolver = rowData =>
            rowData.isTableEditing
                ? null
                : rowData.cells[1] === ''
                    ? [
                        {
                            title: 'Edit',
                            onClick: this.onEditActionClick
                        },
                        {
                            title: 'Add fact'
                        }
                    ]
                    : [
                        {
                            title: 'Edit',
                            onClick: this.onEditActionClick
                        }
                    ];

        this.renderColumns = () => {
            let newColumns = [
                {
                    title: 'Fact',
                    cellFormatters: [ textInputFormatter ]
                },
                {
                    title: 'Value',
                    cellFormatters: [ textInputFormatter ]
                }
            ];

            this.setState({
                columns: newColumns
            });
        };

        this.renderRows = () => {
            const { baselineData } = this.props;
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

            this.setState({
                rows: newRows
            });
        };
    }

    async componentWillMount() {
        const { baselineData, baselineDataLoading } = this.props;

        if (baselineData && !baselineDataLoading) {
            this.renderRows();
            this.renderColumns();
        }
    }

    finishBaselineEdit() {
        const { clearBaselineData } = this.props;

        clearBaselineData();
    }

    render() {
        const { activeEditId, columns, rows, baselineName } = this.state;
        const { baselineDataLoading } = this.props;
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
                <InputGroup>
                    <TextInput value={ baselineName } type="text" onChange={ this.changeBaselineName } aria-label="baseline name"/>
                    <Button onClick={ this.submitBaselineName }>Submit</Button>
                </InputGroup>
                { baselineDataLoading === false
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
                        cells={ columns }
                        rows={ rows }
                    >
                        <TableHeader />
                        <TableBody />
                    </Table>
                }
                <Button
                    className="button-margin"
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
    baselineData: PropTypes.object,
    baselineDataLoading: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        baselineData: state.baselinesTableState.baselineData,
        baselineDataLoading: state.baselinesTableState.baselineDataLoading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateBaseline: () => dispatch(baselinesPageActions.toggleCreateBaseline()),
        clearBaselineData: () => dispatch(baselinesTableActions.clearBaselineData())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBaseline);
