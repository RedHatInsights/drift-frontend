import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import { compareActions } from '../../modules';

class FilterDropDown extends Component {
    constructor(props) {
        super(props);
        this.onToggle = this.onToggle.bind(this);
        this.getFilterbyState = this.getFilterByState.bind(this);
        this.createDropdownItem = this.createDropdownItem.bind(this);
    }

    onToggle() {
        this.props.toggleDropDown();
    }

    getFilterByState(event, filter) {
        this.props.changeFilter(filter);
    }

    createDropdownItem(filter) {
        let dropdownItem = <DropdownItem key={ filter } component="button" onClick={ event =>
            this.getFilterByState(event, filter)
        }>
            { filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase() }
        </DropdownItem>;

        return dropdownItem;
    }

    render() {
        const dropdownItems = [
            this.createDropdownItem('All'),
            this.createDropdownItem('SAME'),
            this.createDropdownItem('DIFFERENT'),
            this.createDropdownItem('INCOMPLETE_DATA')
        ];

        return (
            <React.Fragment>
                <Dropdown
                    onSelect={ this.onToggle }
                    toggle={ <DropdownToggle onToggle={ this.onToggle }>
                        View: { this.props.stateFilter.charAt(0).toUpperCase() + this.props.stateFilter.slice(1).toLowerCase() }
                    </DropdownToggle> }
                    isOpen={ this.props.filterDropdownOpened }
                    dropdownItems={ dropdownItems }
                />
            </React.Fragment>
        );
    }
}

FilterDropDown.propTypes = {
    toggleDropDown: PropTypes.func,
    filterDropdownOpened: PropTypes.bool,
    stateFilter: PropTypes.string,
    changeFilter: PropTypes.func
};

function mapStateToProps(state) {
    return {
        filterDropdownOpened: state.filterDropdownReducer.filterDropdownOpened,
        stateFilter: state.compareReducer.stateFilter
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleDropDown: () => dispatch(compareActions.toggleFilterDropDown()),
        changeFilter: (filter) => dispatch(compareActions.filterByState(filter))
    };
}

export default (connect(mapStateToProps, mapDispatchToProps)(FilterDropDown));
