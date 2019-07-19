import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@patternfly/react-core';

import { baselinesPageActions } from '../redux';

class CreateBaselineButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { toggleCreateBaseline } = this.props;

        return (
            <Button
                variant='primary'
                onClick={ toggleCreateBaseline }>
                Create Baseline
            </Button>
        );
    }
}

CreateBaselineButton.propTypes = {
    toggleCreateBaseline: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateBaseline: (() => dispatch(baselinesPageActions.toggleCreateBaseline()))
    };
}

export default connect(null, mapDispatchToProps)(CreateBaselineButton);
