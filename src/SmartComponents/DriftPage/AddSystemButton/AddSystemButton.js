import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@patternfly/react-core';

import { addSystemModalActions } from '../../AddSystemModal/redux';

class AddSystemButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Button
                variant='primary'
                onClick={ this.props.toggleAddSystemModal }>
                Add System
            </Button>
        );
    }
}

AddSystemButton.propTypes = {
    toggleAddSystemModal: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        toggleAddSystemModal: (() => dispatch(addSystemModalActions.toggleAddSystemModal()))
    };
}

export default connect(null, mapDispatchToProps)(AddSystemButton);
