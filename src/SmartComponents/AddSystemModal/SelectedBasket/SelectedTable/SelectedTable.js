import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import SelectedBasketCheckbox from '../SelectedBasketCheckbox/SelectedBasketCheckbox';

export class SelectedTable extends Component {
    constructor(props) {
        super(props);
    }

    buildRows = () => {
        const { entities, findType, selectedBaselineContent, selectedHSPContent, selectedSystemContent, handleDeselect } = this.props;
        let rows = [];

        selectedBaselineContent.forEach(function(baseline) {
            rows.push(
                <tr>
                    <td>
                        <SelectedBasketCheckbox
                            type='baseline'
                            findType={ findType }
                            id={ baseline.id }
                            handleDeselect={ handleDeselect }
                        />
                    </td>
                    <td>{ baseline.icon }</td>
                    <td style={{ 'align-content': 'left' }}>{ baseline.name }</td>
                </tr>
            );
        });

        selectedSystemContent.forEach(function(system) {
            rows.push(
                <tr>
                    <td>
                        <SelectedBasketCheckbox
                            type='system'
                            findType={ findType }
                            id={ system.id }
                            handleDeselect={ handleDeselect }
                        />
                    </td>
                    <td>{ system.icon }</td>
                    <td style={{ 'align-content': 'left' }}>{ system.name }</td>
                </tr>
            );

            selectedHSPContent?.forEach(function(hsp) {
                if (hsp.system_id === system.id) {
                    rows.push(
                        <tr>
                            <td>
                                <SelectedBasketCheckbox
                                    type='hsp'
                                    findType={ findType }
                                    id={ hsp.id }
                                    handleDeselect={ handleDeselect }
                                />
                            </td>
                            <td>{ hsp.icon }</td>
                            <td style={{ 'align-content': 'left' }}>
                                <div>{ system.name }</div>
                                <div>{ moment.utc(hsp.captured_date).format('DD MMM YYYY, HH:mm UTC') }</div>
                            </td>
                        </tr>
                    );
                }
            });
        });

        selectedHSPContent?.forEach(function(hsp) {
            if (!entities?.selectedSystemIds?.includes(hsp.system_id)) {

                rows.push(
                    <tr>
                        <td>
                            <SelectedBasketCheckbox
                                type='hsp'
                                findType={ findType }
                                id={ hsp.id }
                                handleDeselect={ handleDeselect }
                            />
                        </td>
                        <td>{ hsp.icon }</td>
                        <td style={{ 'align-content': 'left' }}>
                            <div>{ hsp.system_name }</div>
                            <div>{ moment.utc(hsp.captured_date).format('DD MMM YYYY, HH:mm UTC') }</div>
                        </td>
                    </tr>
                );
            }
        });

        return rows;
    }

    render() {
        return (
            <React.Fragment>
                <table className='pf-c-table'>
                    <tbody>
                        { this.buildRows() }
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

SelectedTable.propTypes = {
    selectedBaselineContent: PropTypes.array,
    entities: PropTypes.object,
    selectedHSPContent: PropTypes.array,
    selectedSystemContent: PropTypes.array,
    findType: PropTypes.func,
    handleDeselect: PropTypes.func
};

export default SelectedTable;
