import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Tooltip } from '@patternfly/react-core';

import { createBaselineModalActions } from '../CreateBaselineModal/redux';
import { addSystemModalActions } from '../../AddSystemModal/redux';

export class CreateBaselineButton extends Component {
    constructor(props) {
        super(props);
    }

    createBaseline = () => {
        const { history, toggleCreateBaselineModal, addSystemModalOpened, toggleAddSystemModal } = this.props;

        if (history.location.pathname === '/') {
            if (addSystemModalOpened === true) {
                toggleAddSystemModal();
            }

            history.push({ pathname: 'baselines' });
        }

        toggleCreateBaselineModal();
    }

    render() {
        const { emptyState, loading, permissions } = this.props;

        return (
            <React.Fragment>
                { !permissions.baselinesWrite && permissions.baselinesWrite !== undefined
                    ? <Tooltip
                        content={ <div>You do not have permissions to perform this action</div> }
                    >
                        <div className={ emptyState ? 'tooltip-button-margin' : null }>
                            <Button
                                id='create-baseline-button'
                                variant='primary'
                                onClick={ this.createBaseline }
                                isDisabled
                                ouiaId='create-baseline-button'
                            >
                                Create baseline
                            </Button>
                        </div>
                    </Tooltip>
                    : <Button
                        id='create-baseline-button'
                        variant='primary'
                        onClick={ this.createBaseline }
                        ouiaId='create-baseline-button'
                        isDisabled={ loading }>
                        Create baseline
                    </Button>
                }
            </React.Fragment>
        );
    }
}

CreateBaselineButton.propTypes = {
    toggleCreateBaselineModal: PropTypes.func,
    toggleAddSystemModal: PropTypes.func,
    history: PropTypes.object,
    addSystemModalOpened: PropTypes.bool,
    loading: PropTypes.bool,
    emptyState: PropTypes.bool,
    permissions: PropTypes.object
};

function mapStateToProps(state) {
    return {
        addSystemModalOpened: state.addSystemModalState.addSystemModalOpened
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateBaselineModal: () => dispatch(createBaselineModalActions.toggleCreateBaselineModal()),
        toggleAddSystemModal: () => dispatch(addSystemModalActions.toggleAddSystemModal())
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateBaselineButton));
