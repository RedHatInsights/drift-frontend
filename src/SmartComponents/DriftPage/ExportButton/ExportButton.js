import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compareActions } from '../../modules';
import { Dropdown, KebabToggle, DropdownItem } from '@patternfly/react-core';

class ExportButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const dropdownItems = [
            <DropdownItem key="export" component="button" onClick={ this.props.exportToCSV }>Export</DropdownItem>
        ];
        return (
            <Dropdown
                style={ { float: 'right' } }
                toggle={ <KebabToggle onToggle={ this.props.toggleKebab } /> }
                isOpen={ this.props.kebabOpened }
                dropdownItems={ dropdownItems }
            />
        );
    }
}

ExportButton.propTypes = {
    exportToCSV: PropTypes.func,
    toggleKebab: PropTypes.func,
    kebabOpened: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        kebabOpened: state.exportReducer.kebabOpened
    };
}

function mapDispatchToProps(dispatch) {
    return {
        exportToCSV: (() => dispatch(compareActions.exportToCSV())),
        toggleKebab: () => dispatch(compareActions.toggleKebab())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportButton);
