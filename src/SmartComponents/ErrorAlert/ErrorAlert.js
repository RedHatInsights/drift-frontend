import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

import { compareActions } from '../modules';

class ErrorAlert extends Component {
    constructor(props) {
        super(props);
        this.confirmModal = this.confirmModal.bind(this);
        this.setHistory = this.setHistory.bind(this);
    }

    confirmModal(compareData) {
        this.props.toggleModal();
        this.props.resetSelectedSystemIds();
        this.props.revertCompareData(compareData);
        this.setHistory();
    }

    setHistory() {
        this.props.history.push({
            search: ''
        });

        /*eslint-disable camelcase*/
        this.props.history.push({
            search: '?' + queryString.stringify({ system_ids: this.props.previousStateSystems.map(system => system.id) })
        });
        /*eslint-enable camelcase*/
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
                                onClose={ () => this.confirmModal(this.props.fullCompareData) }
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
    resetSelectedSystemIds: PropTypes.func,
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
        fullCompareData: state.compareReducer.fullCompareData,
        previousStateSystems: state.compareReducer.previousStateSystems,
        errorAlertOpened: state.errorAlertReducer.errorAlertOpened,
        error: state.compareReducer.error
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleModal: () => dispatch(compareActions.toggleErrorAlert()),
        resetSelectedSystemIds: () => dispatch(compareActions.resetSelectedSystemIds()),
        revertCompareData: (compareData) => dispatch(compareActions.revertCompareData(compareData))
    };
}

export default withRouter (connect(mapStateToProps, mapDispatchToProps)(ErrorAlert));
