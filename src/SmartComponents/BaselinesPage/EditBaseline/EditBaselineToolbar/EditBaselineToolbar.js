import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';
import { BulkSelect } from '@redhat-cloud-services/frontend-components';

import EditBaselineKebab from '../EditBaselineKebab/EditBaselineKebab';
import AddFactButton from '../AddFactButton/AddFactButton';
import helpers from '../../../helpers';

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
            ]
        };
    }

    render() {
        const { isDisabled, onBulkSelect, selected, totalFacts } = this.props;
        const { bulkSelectItems } = this.state;

        return (
            <Toolbar className='display-margin'>
                <ToolbarGroup>
                    <ToolbarItem>
                        <BulkSelect
                            count={ selected > 0 ? selected : null }
                            items={ bulkSelectItems }
                            checked={ helpers.findCheckedValue(totalFacts, selected) }
                            onSelect={ () => onBulkSelect(!selected > 0) }
                            isDisabled={ isDisabled }
                        />
                    </ToolbarItem>
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarItem>
                        <AddFactButton />
                    </ToolbarItem>
                    <ToolbarItem>
                        <EditBaselineKebab />
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>
        );
    };
}

EditBaselineToolbar.propTypes = {
    isDisabled: PropTypes.bool,
    onBulkSelect: PropTypes.func,
    selected: PropTypes.any,
    totalFacts: PropTypes.number
};

export default EditBaselineToolbar;
