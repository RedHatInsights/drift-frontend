import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { baselinesKebabActions } from './redux';
import { Dropdown, KebabToggle, DropdownItem } from '@patternfly/react-core';

class BaselinesKebab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            kebabOpened: false
        };

        this.exportSelect = this.exportSelect.bind(this);

        this.toggleKebab = () => {
            const { kebabOpened } = this.state;
            this.setState({
                kebabOpened: !kebabOpened
            });
        };
    }

    exportSelect() {
        const { baselineTableData } = this.props;
        this.toggleKebab();
        this.props.exportToCSV(baselineTableData);
    }

    render() {
        const { kebabOpened } = this.state;
        const dropdownItems = [
            <DropdownItem key="export" component="button" onClick={ this.exportSelect }>Export as CSV</DropdownItem>
        ];
        return (
            <Dropdown
                style={ { float: 'left' } }
                className={ 'action-kebab' }
                toggle={ <KebabToggle onToggle={ this.toggleKebab } /> }
                isOpen={ kebabOpened }
                dropdownItems={ dropdownItems }
                isPlain
            />
        );
    }
}

BaselinesKebab.propTypes = {
    exportToCSV: PropTypes.func,
    baselineTableData: PropTypes.array
};

function mapStateToProps(state) {
    return {
        baselineTableData: state.baselinesTableState.baselineTableData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        exportToCSV: (baselineTableData) => dispatch(baselinesKebabActions.exportToCSV(baselineTableData))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BaselinesKebab));
