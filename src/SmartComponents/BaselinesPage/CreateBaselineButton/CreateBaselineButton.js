import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Tooltip } from '@patternfly/react-core';

import { createBaselineModalActions } from '../CreateBaselineModal/redux';
import { addSystemModalActions } from '../../AddSystemModal/redux';
import { useLocation, useNavigate } from 'react-router-dom';

export class CreateBaselineButton extends Component {
    constructor(props) {
        super(props);
    }

    createBaseline = () => {
        const { toggleCreateBaselineModal, addSystemModalOpened, toggleAddSystemModal, location, navigate } = this.props;

        if (location.pathname === '/') {
            if (addSystemModalOpened === true) {
                toggleAddSystemModal();
            }

            navigate('baselines');
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
    addSystemModalOpened: PropTypes.bool,
    loading: PropTypes.bool,
    emptyState: PropTypes.bool,
    permissions: PropTypes.object,
    navigate: PropTypes.func,
    location: PropTypes.object
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

const CreateBaselineButtonWithHooks = props => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <CreateBaselineButton { ...props } navigate={ navigate } location={ location } />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateBaselineButtonWithHooks);
