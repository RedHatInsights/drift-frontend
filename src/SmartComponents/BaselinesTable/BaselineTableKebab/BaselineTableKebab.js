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

        this.fetchBaseline = this.fetchBaseline.bind(this);
        this.onKebabToggle = this.onKebabToggle.bind(this);
    }

    fetchBaseline() {
        const { fullBaselineListData, fetchBaselineData, baselineData } = this.props;
        let baselineId = baselinesTableHelpers.findBaselineId(baselineData, fullBaselineListData);

        fetchBaselineData(baselineId);
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
                onClick={ this.fetchBaseline }>
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
    fetchBaselineData: PropTypes.func,
    fullBaselineListData: PropTypes.array,
    baselineData: PropTypes.array
};

function mapStateToProps(state) {
    return {
        fullBaselineListData: state.baselinesTableState.fullBaselineListData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBaselineData: (baselineUUID) => dispatch(baselinesTableActions.fetchBaselineData(baselineUUID))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BaselineTableKebab));
