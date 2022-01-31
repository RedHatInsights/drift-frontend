import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Checkbox, Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import PropTypes from 'prop-types';

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

    addFilter = async (filter) => {
        const { filterFunction, setHistory } = this.props;

        await filterFunction(filter);
        setHistory();
    }

    createDropdownItem(filter, type) {
        let dropdownItem =
            <DropdownItem
                data-ouia-component-id={ `${ type }-filter-option-${ filter.display }` } >
                <Checkbox
                    id={ filter.display }
                    data-ouia-component-type='PF4/Checkbox'
                    data-ouia-component-id={ `${ type }-filter-option-checkbox-${ filter.display }` }
                    label={ filter.display }
                    isChecked={ filter.selected }
                    onChange={ () => this.addFilter(filter) }
                />
            </DropdownItem>;
        return dropdownItem;
    }

    createDropdownArray(filters, type) {
        let dropdownItems = [];

        filters.forEach(function(filter) {
            let dropdownItem = this.createDropdownItem(filter, type);
            dropdownItems.push(dropdownItem);
        }.bind(this));

        return dropdownItems;
    }

    render() {
        const { filters, type } = this.props;
        let dropdownItems = [];
        const ouiaPrefix = type.split(' ').join('-').toLowerCase();

        dropdownItems = this.createDropdownArray(filters, type);

        return (
            <React.Fragment>
                <Dropdown
                    ouiaId={ ouiaPrefix }
                    toggle={ <DropdownToggle
                        onToggle={ this.onToggle }
                        ouiaId={ `${ ouiaPrefix }-toggle` }>
                        { type === 'State'
                            ? `Filter by ${ type.toLowerCase() }`
                            : 'Show'
                        }
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
    factTypeFilters: PropTypes.array,
    filterDropdownOpened: PropTypes.bool,
    filters: PropTypes.array,
    filterFunction: PropTypes.func,
    setHistory: PropTypes.func,
    type: PropTypes.string
};

function mapStateToProps(state) {
    return {
        filterDropdownOpened: state.filterDropdownOpened
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleDropDown: () => dispatch(filterDropdownActions.toggleFilterDropDown())
    };
}

export default (connect(mapStateToProps, mapDispatchToProps)(FilterDropDown));
