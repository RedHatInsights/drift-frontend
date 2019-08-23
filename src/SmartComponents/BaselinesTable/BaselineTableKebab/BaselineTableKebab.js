import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown, KebabToggle, DropdownItem } from '@patternfly/react-core';

import { baselinesTableActions } from '../redux';
import baselinesTableHelpers from '../redux/helpers';

class BaselineTableKebab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };

        this.findBaselineUUID = this.findBaselineUUID.bind(this);
        this.onKebabToggle = this.onKebabToggle.bind(this);
    }

    findBaselineUUID() {
        const { fullBaselineListData, addBaselineUUID, baselineRowData } = this.props;
        let baselineId = baselinesTableHelpers.findBaselineId(baselineRowData, fullBaselineListData);

        addBaselineUUID(baselineId);
    }

    onKebabToggle(isOpen) {
        this.setState({
            isOpen
        });
    }

    render() {
        const { isOpen } = this.state;
        const dropdownItems = [
            <DropdownItem
                key="edit"
                component="button"
                onClick={ this.findBaselineUUID }>
                Edit
            </DropdownItem>
        ];

        return (
            <Dropdown
                style={ { float: 'left' } }
                className={ 'baseline-table-kebab' }
                toggle={ <KebabToggle onToggle={ (isOpen) => this.onKebabToggle(isOpen) } /> }
                isOpen={ isOpen }
                dropdownItems={ dropdownItems }
                isPlain
            />
        );
    }
}

BaselineTableKebab.propTypes = {
    addBaselineUUID: PropTypes.func,
    fullBaselineListData: PropTypes.array,
    baselineRowData: PropTypes.array
};

function mapStateToProps(state) {
    return {
        fullBaselineListData: state.baselinesTableState.fullBaselineListData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addBaselineUUID: (baselineUUID) => dispatch(baselinesTableActions.addBaselineUUID(baselineUUID))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BaselineTableKebab));
