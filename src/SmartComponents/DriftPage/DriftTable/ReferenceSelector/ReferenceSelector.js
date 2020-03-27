import React, { Component } from 'react';
import { OutlinedStarIcon, StarIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

class ReferenceSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isReference: this.props.isReference
        };
    }

    render() {
        const { updateReferenceId, id } = this.props;
        const { isReference } = this.state;

        return (
            isReference
                ? <StarIcon
                    className='reference-selector pointer'
                    onClick={ () => updateReferenceId() }
                />
                : <OutlinedStarIcon
                    className='reference-selector pointer'
                    onClick={ () => updateReferenceId(id) }
                />
        );
    }
}

ReferenceSelector.propTypes = {
    isReference: PropTypes.bool,
    updateReferenceId: PropTypes.func,
    id: PropTypes.string
};

export default ReferenceSelector;
