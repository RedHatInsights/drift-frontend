import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compareActions } from '../../modules';
import { DownloadIcon } from '@patternfly/react-icons';
import { Button } from '@patternfly/react-core';

class ExportButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Button
                style={ { float: 'right' } }
                variant='link'
                onClick={ this.props.exportToCSV }>
                <DownloadIcon />
            </Button>
        );
    }
}

ExportButton.propTypes = {
    exportToCSV: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        exportToCSV: (() => dispatch(compareActions.exportToCSV()))
    };
}

export default connect(null, mapDispatchToProps)(ExportButton);
