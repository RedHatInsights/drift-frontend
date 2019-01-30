import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';

export class AddSystem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Button
                variant='primary'
                onClick={ this.props.getAddSystemModal }>
                Add System
            </Button>
        );
    }
}

AddSystem.propTypes = {
    getAddSystemModal: PropTypes.func
};
