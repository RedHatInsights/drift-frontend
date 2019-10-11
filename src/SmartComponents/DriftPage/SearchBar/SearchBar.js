import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextInput } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { compareActions } from '../../modules';

export class SearchBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: this.props.factFilter
        };

        this.setFactFilter = this.setFactFilter.bind(this);
    }

    updateFactFilter = (filter) => {
        this.setState({ filter });
        this.setFactFilter(filter);
    }

    setFactFilter = _.debounce(function(filter) {
        this.props.changeFactFilter(filter);
    }, 250);

    render() {
        return (
            <React.Fragment>
                <TextInput
                    value={ this.state.filter }
                    id="filterByFact"
                    placeholder="Filter by fact"
                    onChange={ this.updateFactFilter }
                    aria-label="filter by fact"
                />
            </React.Fragment>
        );
    }
}

SearchBar.propTypes = {
    changeFactFilter: PropTypes.func,
    factFilter: PropTypes.string
};

function mapStateToProps(state) {
    return {
        factFilter: state.compareState.factFilter
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeFactFilter: (factFilter) => dispatch(compareActions.filterByFact(factFilter))
    };
}

export default (connect(mapStateToProps, mapDispatchToProps)(SearchBar));
