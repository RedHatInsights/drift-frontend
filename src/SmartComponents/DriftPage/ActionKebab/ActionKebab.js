import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compareActions } from '../../modules';
import { Dropdown, KebabToggle, DropdownItem } from '@patternfly/react-core';
import { setHistory } from '../../../Utilities/SetHistory';

class ActionKebab extends Component {
    constructor(props) {
        super(props);

        this.exportSelect = this.exportSelect.bind(this);
        this.removeSystemsSelect = this.removeSystemsSelect.bind(this);
    }

    exportSelect() {
        this.props.toggleKebab();
        this.props.exportToCSV();
    }

    removeSystemsSelect() {
        const { history } = this.props;

        this.props.toggleKebab();
        this.props.removeSystems();
        setHistory(history, []);
    }

    render() {
        const dropdownItems = [
            <DropdownItem key="export" component="button" onClick={ this.exportSelect }>Export as CSV</DropdownItem>,
            <DropdownItem key="remove-systems" component="button" onClick={ this.removeSystemsSelect }>Clear all comparisons</DropdownItem>
        ];
        return (
            <Dropdown
                style={ { float: 'left' } }
                className={ 'action-kebab' }
                toggle={ <KebabToggle onToggle={ this.props.toggleKebab } /> }
                isOpen={ this.props.kebabOpened }
                dropdownItems={ dropdownItems }
                isPlain
            />
        );
    }
}

ActionKebab.propTypes = {
    exportToCSV: PropTypes.func,
    removeSystems: PropTypes.func,
    toggleKebab: PropTypes.func,
    kebabOpened: PropTypes.bool,
    history: PropTypes.object
};

function mapStateToProps(state) {
    return {
        kebabOpened: state.actionKebabReducer.kebabOpened
    };
}

function mapDispatchToProps(dispatch) {
    return {
        exportToCSV: () => dispatch(compareActions.exportToCSV()),
        removeSystems: () => dispatch(compareActions.clearState()),
        toggleKebab: () => dispatch(compareActions.toggleKebab())
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActionKebab));
