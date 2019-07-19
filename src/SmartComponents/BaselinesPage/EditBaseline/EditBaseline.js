import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { AddCircleOIcon } from '@patternfly/react-icons';

import { baselinesPageActions } from '../redux';
import { baselinesTableActions } from '../../BaselinesTable/redux';

class EditBaseline extends Component {
    constructor(props) {
        super(props);
        this.finishBaselineEdit = this.finishBaselineEdit.bind(this);
        this.renderRows = this.renderRows.bind(this);
        this.renderLoadingRows = this.renderLoadingRows.bind(this);
        this.renderTable = this.renderTable.bind(this);
    }

    finishBaselineEdit() {
        const { clearBaselineData, toggleCreateBaseline, creatingNewBaseline } = this.props;

        clearBaselineData();

        if (creatingNewBaseline) {
            toggleCreateBaseline();
        }
    }

    renderRows() {
        const { baselineData } = this.props;
        let rows = [];

        if (!baselineData) {
            rows = [];
        } else {
            baselineData.baseline_facts.forEach(function(fact) {
                let row = [];
                row.push(fact.name);
                row.push(fact.value);
                rows.push(row);
            });
        }

        return rows;
    }

    renderLoadingRows() {
        let rows = [];
        let rowData = [];

        for (let i = 0; i < 2; i += 1) {
            rowData.push(<Skeleton size={ SkeletonSize.md } />);
        }

        for (let i = 0; i < 5; i += 1) {
            rows.push(rowData);
        }

        return rows;
    }

    renderTable() {
        const { loading } = this.props;
        let columns = [ 'Fact', 'Value' ];
        let table;

        if (loading === false) {
            let rows = this.renderRows();

            table = <Table
                cells={ columns }
                rows={ rows }
            >
                <TableHeader />
                <TableBody />
            </Table>;
        } else {
            let rows = this.renderLoadingRows();

            table = <Table
                cells={ columns }
                rows={ rows }
            >
                <TableHeader />
                <TableBody />
            </Table>;
        }

        return table;
    }

    render() {
        const { loading, baselineData } = this.props;
        let baselineName;

        if (baselineData) {
            baselineName = baselineData.display_name;
        } else {
            baselineName = 'Create baseline name';
        }

        return (
            <React.Fragment>
                { baselineName }
                { this.renderTable() }
                { !loading ?
                    <div>
                        <Button
                            className="button-margin"
                            isBlock
                        >
                            <AddCircleOIcon/>
                            Add fact
                        </Button>
                        <Button
                            className="button-margin"
                            style={ { float: 'right' } }
                            variant='primary'
                            onClick={ this.finishBaselineEdit }>
                            Finish
                        </Button>
                    </div> : null
                }
            </React.Fragment>
        );
    }
}

EditBaseline.propTypes = {
    toggleCreateBaseline: PropTypes.func,
    clearBaselineData: PropTypes.func,
    creatingNewBaseline: PropTypes.bool,
    baselineData: PropTypes.object,
    loading: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        creatingNewBaseline: state.baselinesPageState.creatingNewBaseline,
        baselineData: state.baselinesTableState.baselineData,
        loading: state.baselinesTableState.loading
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateBaseline: () => dispatch(baselinesPageActions.toggleCreateBaseline()),
        clearBaselineData: () => dispatch(baselinesTableActions.clearBaselineData())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBaseline);
