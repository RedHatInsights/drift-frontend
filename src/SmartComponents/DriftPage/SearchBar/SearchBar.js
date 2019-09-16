import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextInput } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { compareActions } from '../../modules';

export class SearchBar extends Component {
    constructor(props) {
        super(props);
    }

    updateFactFilter() {
        const { changeFactFilter } = this.props;
        let factFilter = document.getElementById('filterByFact').value;
        changeFactFilter(factFilter);
    }

    render() {
        return (
            <React.Fragment>
                <TextInput
                    id="filterByFact"
                    placeholder="Filter by Fact"
                    onChange={ _.debounce(this.props.changeFactFilter, 250) }
                    aria-label="filter by fact"
                />
            </React.Fragment>
        );
    }
}

SearchBar.propTypes = {
    changeFactFilter: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        changeFactFilter: (factFilter) => dispatch(compareActions.filterByFact(factFilter))
    };
}

export default (connect(null, mapDispatchToProps)(SearchBar));
