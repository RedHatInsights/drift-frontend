import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { SimpleTableFilter } from '@redhat-cloud-services/frontend-components';
import { baselinesTableActions } from '../BaselinesTable/redux';

export class BaselinesSearchBar extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch = debounce(function(search) {
        this.props.fetchBaselines(search);
    }, 250)

    render() {
        return (
            <React.Fragment>
                <SimpleTableFilter buttonTitle={ null }
                    onFilterChange={ this.handleSearch }
                    placeholder="Search by name"
                />
            </React.Fragment>
        );
    }
}

BaselinesSearchBar.propTypes = {
    fetchBaselines: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        fetchBaselines: ((search) => dispatch(baselinesTableActions.fetchBaselines(search)))
    };
}

export default (connect(null, mapDispatchToProps)(BaselinesSearchBar));
