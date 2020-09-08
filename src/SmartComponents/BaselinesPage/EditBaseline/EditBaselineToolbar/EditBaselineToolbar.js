import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ToolbarItem, ToolbarContent } from '@patternfly/react-core';
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
                        />
                    </ToolbarItem>
                    <ToolbarItem>
                        <EditBaselineKebab />
                    </ToolbarItem>
                </ToolbarContent>
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
