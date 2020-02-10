import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { compareActions } from '../modules';
import { errorAlertActions } from './redux';
import { setHistory } from '../../Utilities/SetHistory';
import { baselinesTableActions } from '../BaselinesTable/redux';

class ErrorAlert extends Component {
    constructor(props) {
        super(props);
    }

    confirmDriftModal = () => {
        const { toggleModal, revertCompareData, history, previousStateSystems } = this.props;

        toggleModal();
        revertCompareData();
        setHistory(history, previousStateSystems.map(system => system.id));
    }

    confirmBaselineModal = () => {
        const { toggleModal, revertBaselineFetch, tableId } = this.props;

        toggleModal();
        revertBaselineFetch(tableId);
    }

    render() {
        const { errorAlertOpened, error, baselineError } = this.props;

        return (
            <React.Fragment>
                { errorAlertOpened && (
                    <Alert
                        variant="danger"
                        title="Error"
                        action={
                            <AlertActionCloseButton
                                onClose={ () =>
                                    error.status ? this.confirmDriftModal() : this.confirmBaselineModal()
                                }
                            />
                        }
                    >
                        Status Code: { error.status ? error.status : baselineError.status }<br></br>
                        { error.detail ? error.detail : baselineError.detail }
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
    baselineError: PropTypes.object,
    toggleModal: PropTypes.func,
    history: PropTypes.object,
    fullCompareData: PropTypes.array,
    revertCompareData: PropTypes.func,
    previousStateSystems: PropTypes.array,
    revertBaselineFetch: PropTypes.func,
    tableId: PropTypes.string
};

function mapStateToProps(state) {
    return {
        fullCompareData: state.compareState.fullCompareData,
        previousStateSystems: state.compareState.previousStateSystems,
        errorAlertOpened: state.errorAlertOpened,
        error: state.compareState.error,
        baselineError: state.baselinesTableState.checkboxTable.baselineError
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleModal: () => dispatch(errorAlertActions.toggleErrorAlert()),
        revertCompareData: () => dispatch(compareActions.revertCompareData()),
        revertBaselineFetch: (tableId) => dispatch(baselinesTableActions.revertBaselineFetch(tableId))
    };
}

export default withRouter (connect(mapStateToProps, mapDispatchToProps)(ErrorAlert));
