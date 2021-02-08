import React, { Component } from 'react';
import { Tooltip } from '@patternfly/react-core';
import { OutlinedStarIcon, StarIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

class ReferenceSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isReference: this.props.isReference
        };
    }

    renderIcon() {
        const { updateReferenceId, item } = this.props;
        const { isReference } = this.state;

        return (
            isReference
                ? <StarIcon
                    className='reference-selector pointer'
                    data-ouia-component-type='PF4/Button'
                    data-ouia-component-id={ 'reference-selector-' + item.id }
                    onClick={ () => updateReferenceId() }
                />
                : <OutlinedStarIcon
                    className='reference-selector pointer'
                    data-ouia-component-type='PF4/Button'
                    data-ouia-component-id={ 'reference-selector-' + item.id }
                    onClick={ () => updateReferenceId(item.id) }
                />
        );
    }

    renderMessage() {
        const { isReference } = this.state;
        const { item } = this.props;
        let type = item.type;

        if (item.type === 'historical-system-profile') {
            type = 'historical system';
        }

        if (isReference) {
            return <div>This is the reference the other items are being compared against.</div>;
        } else {
            return <div>Use this { type } as a reference to compare.</div>;
        }
    }

    render() {
        return (
            <Tooltip
                position='top'
                content={ this.renderMessage() }
            >
                { this.renderIcon() }
            </Tooltip>
        );
    }
}

ReferenceSelector.propTypes = {
    isReference: PropTypes.bool,
    updateReferenceId: PropTypes.func,
    item: PropTypes.object
};

export default ReferenceSelector;
