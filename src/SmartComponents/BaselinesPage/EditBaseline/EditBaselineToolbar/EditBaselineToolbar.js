import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropdownItem, Toolbar, ToolbarGroup, ToolbarItem, ToolbarContent } from '@patternfly/react-core';
import { BulkSelect } from '@redhat-cloud-services/frontend-components';

import EditBaselineKebab from '../EditBaselineKebab/EditBaselineKebab';
import AddFactButton from '../AddFactButton/AddFactButton';
import helpers from '../../../helpers';
import ExportCSVButton from '../../../ExportCSVButton/ExportCSVButton';

export class EditBaselineToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bulkSelectItems: [
                {
                    title: 'Select all',
                    key: 'select-all',
                    onClick: () => this.props.onBulkSelect(true)
                }, {
                    title: 'Select none',
                    key: 'select-none',
                    onClick: () => this.props.onBulkSelect(false)
                }
            ],
            dropdownOpen: false,
            dropdownItems: [
                <DropdownItem
                    key='export-to-CSV'
                    component='button'
                    onClick={ () => this.props.exportToCSV(this.props.tableData, this.props.baselineData) }
                >
                    Export to CSV
                </DropdownItem>
            ]
        };
    }

    onToggle = () => {
        const { dropdownOpen } = this.state;

        this.setState({
            dropdownOpen: !dropdownOpen
        });
    }

    render() {
        const { hasWritePermissions, isDisabled, onBulkSelect, selected, totalFacts } = this.props;
        const { bulkSelectItems, dropdownItems, dropdownOpen } = this.state;

        return (
            <Toolbar className='drift-toolbar'>
                <ToolbarContent>
                    <ToolbarItem>
                        <BulkSelect
                            count={ selected > 0 ? selected : null }
                            items={ bulkSelectItems }
                            checked={ helpers.findCheckedValue(totalFacts, selected) }
                            onSelect={ () => onBulkSelect(!selected > 0) }
                            isDisabled={ isDisabled }
                        />
                    </ToolbarItem>
                    <ToolbarItem>
                        <AddFactButton
                            isDisabled={ totalFacts > 0 ? false : true }
                            hasWritePermissions={ hasWritePermissions }
                        />
                    </ToolbarItem>
                    <ToolbarGroup variant='icon-button-group'>
                        <ToolbarItem>
                            <ExportCSVButton
                                dropdownItems={ dropdownItems }
                                isOpen={ dropdownOpen }
                                onToggle={ this.onToggle }
                            />
                        </ToolbarItem>
                        <ToolbarItem>
                            <EditBaselineKebab />
                        </ToolbarItem>
                    </ToolbarGroup>
                </ToolbarContent>
            </Toolbar>
        );
    };
}

EditBaselineToolbar.propTypes = {
    isDisabled: PropTypes.bool,
    onBulkSelect: PropTypes.func,
    selected: PropTypes.any,
    totalFacts: PropTypes.number,
    exportToCSV: PropTypes.func,
    tableData: PropTypes.array,
    baselineData: PropTypes.object,
    hasWritePermissions: PropTypes.bool
};

export default EditBaselineToolbar;
