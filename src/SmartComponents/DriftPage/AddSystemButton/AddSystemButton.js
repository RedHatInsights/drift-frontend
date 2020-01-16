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
                className="add-system-button"
                variant='primary'
                onClick={ this.props.toggleAddSystemModal }>
                { this.props.isTable ? 'Add' : 'Add systems or baselines' }
            </Button>
        );
    }
}

AddSystemButton.propTypes = {
    toggleAddSystemModal: PropTypes.func,
    isTable: PropTypes.bool
};

function mapDispatchToProps(dispatch) {
    return {
        toggleAddSystemModal: (() => dispatch(addSystemModalActions.toggleAddSystemModal()))
    };
}

export default connect(null, mapDispatchToProps)(AddSystemButton);
