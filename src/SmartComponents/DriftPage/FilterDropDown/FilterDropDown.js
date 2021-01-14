import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import { compareActions } from '../../modules';
import { filterDropdownActions } from './redux';

class FilterDropDown extends Component {
    constructor(props) {
        super(props);
        this.onToggle = this.onToggle.bind(this);
        this.createDropdownItem = this.createDropdownItem.bind(this);
    }

    onToggle() {
        this.props.toggleDropDown();
    }

    createDropdownItem(stateFilter) {
        let dropdownItem =
            <DropdownItem>
                <Checkbox
                    id={ stateFilter.display }
                    label={ stateFilter.display }
                    isChecked={ stateFilter.selected }
                    onChange={ () =>
                        this.props.addStateFilter(stateFilter) }
                />
            </DropdownItem>;
        return dropdownItem;
    }

    createDropdownArray(stateFilters) {
        let dropdownItems = [];

        stateFilters.forEach(function(stateFilter) {
            let dropdownItem = this.createDropdownItem(stateFilter);
            dropdownItems.push(dropdownItem);
        }.bind(this));

        return dropdownItems;
    }

    createSelectedViewsString(stateFilters) {
        let selectedViewsArray = [];
        let selectedViews = '';

        for (let i = 0; i < stateFilters.length; i++) {
            if (stateFilters[i].selected) {
                selectedViewsArray.push(stateFilters[i].display);
            }
        }

        for (let i = 0; i < selectedViewsArray.length; i++) {
            selectedViews += selectedViewsArray[i];

            if ((i + 1) < selectedViewsArray.length) {
                selectedViews += ', ';
            }
        }

        return selectedViews;
    }

    render() {
        const { stateFilters } = this.props;
        let dropdownItems = [];
        let selectedViews = '';

        dropdownItems = this.createDropdownArray(stateFilters);
        selectedViews = this.createSelectedViewsString(stateFilters);

        return (
            <React.Fragment>
                <Dropdown
                    toggle={ <DropdownToggle onToggle={ this.onToggle }>
                        View: { selectedViews }
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
    stateFilters: PropTypes.array,
    addStateFilter: PropTypes.func
};

function mapStateToProps(state) {
    return {
        filterDropdownOpened: state.filterDropdownOpened,
        stateFilters: state.compareState.stateFilters
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleDropDown: () => dispatch(filterDropdownActions.toggleFilterDropDown()),
        addStateFilter: (filter) => dispatch(compareActions.addStateFilter(filter))
    };
}

export default (connect(mapStateToProps, mapDispatchToProps)(FilterDropDown));
