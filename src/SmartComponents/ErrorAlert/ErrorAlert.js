import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { compareActions } from '../modules';
import { errorAlertActions } from './redux';
import { setHistory } from '../../Utilities/SetHistory';

class ErrorAlert extends Component {
    constructor(props) {
        super(props);
        this.confirmModal = this.confirmModal.bind(this);
    }

    confirmModal() {
        const { toggleModal, revertCompareData, history, previousStateSystems } = this.props;

        toggleModal();
        revertCompareData();
        setHistory(history, previousStateSystems.map(system => system.id));
    }

    render() {
        const { errorAlertOpened } = this.props;
        return (
            <React.Fragment>
                { errorAlertOpened && (
                    <Alert
                        variant="danger"
                        title="Error"
                        action={
                            <AlertActionCloseButton
                                onClose={ () => this.confirmModal() }
                            /> }
                    >
                        Status Code: { this.props.error.status }<br></br>
                        { this.props.error.detail }
                    </Alert>
                ) }
            </React.Fragment>
        );
    }
}

ErrorAlert.propTypes = {
    confirmModal: PropTypes.func,
    errorAlertOpened: PropTypes.bool,
    error: PropTypes.object,
    status: PropTypes.number,
    detail: PropTypes.string,
    toggleModal: PropTypes.func,
    history: PropTypes.object,
    clearState: PropTypes.func,
    fullCompareData: PropTypes.array,
    revertCompareData: PropTypes.func,
    previousStateSystems: PropTypes.array
};

function mapStateToProps(state) {
    return {
        fullCompareData: state.compareState.fullCompareData,
        previousStateSystems: state.compareState.previousStateSystems,
        errorAlertOpened: state.errorAlertOpened,
        error: state.compareState.error
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleModal: () => dispatch(errorAlertActions.toggleErrorAlert()),
        revertCompareData: () => dispatch(compareActions.revertCompareData())
    };
}

export default withRouter (connect(mapStateToProps, mapDispatchToProps)(ErrorAlert));
