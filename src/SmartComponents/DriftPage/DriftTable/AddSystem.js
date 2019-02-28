import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';

export class AddSystem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="add-system-header">
                <div className="add-system-icon">
                    <AddCircleOIcon/>
                </div>
                <Button
                    variant='primary'
                    onClick={ this.props.getAddSystemModal }>
                    Add System
                </Button>
            </div>
        );
    }
}

AddSystem.propTypes = {
    getAddSystemModal: PropTypes.func
};
