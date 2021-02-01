import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@patternfly/react-core';

import { addSystemModalActions } from '../../AddSystemModal/redux';

export class AddSystemButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { loading, toggleAddSystemModal, isTable } = this.props;

        return (
            <Button
                variant='primary'
                onClick={ toggleAddSystemModal }
                isDisabled={ loading ? true : false }
                ouiaId={ isTable ? 'add-to-comparison' : 'add-to-comparison-empty' }
            >
                { isTable ? 'Add' : 'Add to comparison' }
            </Button>
        );
    }
}

AddSystemButton.propTypes = {
    toggleAddSystemModal: PropTypes.func,
    isTable: PropTypes.bool,
    loading: PropTypes.bool
};

function mapDispatchToProps(dispatch) {
    return {
        toggleAddSystemModal: (() => dispatch(addSystemModalActions.toggleAddSystemModal()))
    };
}

export default connect(null, mapDispatchToProps)(AddSystemButton);
