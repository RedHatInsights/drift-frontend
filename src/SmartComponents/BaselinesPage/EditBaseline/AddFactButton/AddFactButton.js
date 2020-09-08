import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@patternfly/react-core';

import { editBaselineActions } from '../redux';

class AddFactButton extends Component {
    constructor(props) {
        super(props);
    }

    handleAddFact = () => {
        const { setFactData, toggleFactModal } = this.props;

        setFactData({ factName: '', factValue: '', fact: []});
        toggleFactModal();
    }

    render() {
        const { isDisabled } = this.props;

        return (
            isDisabled
                ? <Button
                    variant='primary'
                    isDisabled
                    onClick={ this.handleAddFact }>
                    Add fact or category
                </Button>
                : <Button
                    variant='primary'
                    onClick={ this.handleAddFact }>
                    Add fact or category
                </Button>
        );
    };
}

AddFactButton.propTypes = {
    toggleFactModal: PropTypes.func,
    setFactData: PropTypes.func,
    isDisabled: PropTypes.bool
};

function mapDispatchToProps(dispatch) {
    return {
        toggleFactModal: () => dispatch(editBaselineActions.toggleFactModal()),
        setFactData: (factData) => dispatch(editBaselineActions.setFactData(factData))
    };
}

export default connect(null, mapDispatchToProps)(AddFactButton);
