import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ExportIcon } from '@patternfly/react-icons';
import { compareActions } from '../../modules';

class ExportCSVButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { exportToCSV } = this.props;

        return (
            <ExportIcon className='pointer not-active' onClick={ exportToCSV } />
        );
    }
}

ExportCSVButton.propTypes = {
    exportToCSV: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        exportToCSV: () => dispatch(compareActions.exportToCSV())
    };
}

export default connect(null, mapDispatchToProps)(ExportCSVButton);
