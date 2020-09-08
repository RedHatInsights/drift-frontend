import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';

export class ErrorAlert extends Component {
    constructor(props) {
        super(props);
    }

    closeToast = (tableId) => {
        const { onClose } = this.props;

        if (tableId) {
            onClose(tableId);
        } else {
            onClose();
        }
    }

    render() {
        const { addNotification, error, tableId } = this.props;

        return (
            <React.Fragment>
                { error.status
                    ? addNotification({
                        variant: 'danger',
                        title: 'Error',
                        description: error.detail,
                        dismissable: true
                    })
                    : null
                }
                { error.status ? this.closeToast(tableId) : null }
            </React.Fragment>
        );
    }
}

ErrorAlert.propTypes = {
    error: PropTypes.object,
    tableId: PropTypes.string,
    onClose: PropTypes.func,
    addNotification: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        addNotification: (payload) => dispatch(addNotification(payload))
    };
}

export default connect(null, mapDispatchToProps)(ErrorAlert);
