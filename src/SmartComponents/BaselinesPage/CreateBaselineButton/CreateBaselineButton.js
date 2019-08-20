import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from '@patternfly/react-core';

import { baselinesPageActions } from '../redux';

class CreateBaselineButton extends Component {
    constructor(props) {
        super(props);
        this.createBaseline = this.createBaseline.bind(this);
    }

    createBaseline() {
        const { history, toggleCreateBaseline } = this.props;

        if (history.location.pathname === '/') {
            history.push({ pathname: 'baselines' });
        }

        toggleCreateBaseline();
    }

    render() {
        return (
            <Button
                variant='primary'
                onClick={ this.createBaseline }>
                Create Baseline
            </Button>
        );
    }
}

CreateBaselineButton.propTypes = {
    toggleCreateBaseline: PropTypes.func,
    history: PropTypes.object
};

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateBaseline: (() => dispatch(baselinesPageActions.toggleCreateBaseline()))
    };
}

export default withRouter(connect(null, mapDispatchToProps)(CreateBaselineButton));
