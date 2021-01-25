import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Tooltip } from '@patternfly/react-core';

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
        const { editBaselineEmptyState, hasWritePermissions, isDisabled } = this.props;

        return (
            <React.Fragment>
                { !hasWritePermissions && hasWritePermissions !== undefined
                    ? <Tooltip
                        content={
                            <div>You do not have permissions to perform this action</div>
                        }
                    >
                        <div className={ editBaselineEmptyState ? 'tooltip-button-margin' : null }>
                            <Button
                                variant='primary'
                                isDisabled
                                onClick={ this.handleAddFact }
                                ouiaId="add_fact"
                            >
                                Add fact or category
                            </Button>
                        </div>
                    </Tooltip>
                    : <Button
                        variant='primary'
                        isDisabled={ isDisabled }
                        onClick={ this.handleAddFact }
                        ouiaId="add_fact"
                    >
                        Add fact or category
                    </Button>
                }
            </React.Fragment>
        );
    };
}

AddFactButton.propTypes = {
    toggleFactModal: PropTypes.func,
    setFactData: PropTypes.func,
    isDisabled: PropTypes.bool,
    hasWritePermissions: PropTypes.bool,
    editBaselineEmptyState: PropTypes.bool
};

function mapDispatchToProps(dispatch) {
    return {
        toggleFactModal: () => dispatch(editBaselineActions.toggleFactModal()),
        setFactData: (factData) => dispatch(editBaselineActions.setFactData(factData))
    };
}

export default connect(null, mapDispatchToProps)(AddFactButton);
