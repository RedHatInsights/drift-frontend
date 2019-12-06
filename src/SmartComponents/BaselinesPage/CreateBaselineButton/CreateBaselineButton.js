import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button } from '@patternfly/react-core';

import { addSystemModalActions } from '../../AddSystemModal/redux';

class CreateBaselineButton extends Component {
    constructor(props) {
        super(props);
    }

    createBaseline = () => {
        const { history, toggleModal, addSystemModalOpened, toggleAddSystemModal } = this.props;

        if (history.location.pathname === '/') {
            if (addSystemModalOpened === true) {
                toggleAddSystemModal();
            }

            history.push({ pathname: 'baselines' });
        }

        toggleModal();
    }

    render() {
        return (
            <Button
                variant='primary'
                onClick={ this.createBaseline }>
                Create baseline
            </Button>
        );
    }
}

CreateBaselineButton.propTypes = {
    toggleModal: PropTypes.func,
    toggleAddSystemModal: PropTypes.func,
    history: PropTypes.object,
    addSystemModalOpened: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        addSystemModalOpened: state.addSystemModalState.addSystemModalOpened
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleAddSystemModal: () => dispatch(addSystemModalActions.toggleAddSystemModal())
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateBaselineButton));
