import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, TextInput } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import { compareActions } from '../../modules';

export class SearchBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Form className="toolbar-pf-actions">
                    <FormGroup fieldId="searchBar" className="toolbar-pf-filter">
                        <TextInput
                            type="search"
                            id="search-bar-box"
                            name="search-bar-box"
                            placeholder="Filter by Fact"
                            value={ this.props.factFilter }
                            onChange={ this.props.changeFactFilter }
                        />
                    </FormGroup>
                </Form>
            </React.Fragment>
        );
    }
}

SearchBar.propTypes = {
    factFilter: PropTypes.string,
    changeFactFilter: PropTypes.func
};

function mapStateToProps(state) {
    return {
        factFilter: state.filterByFactReducer.factFilter
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeFactFilter: (value) => dispatch(compareActions.filterByFact(value))
    };
}

export default (connect(mapStateToProps, mapDispatchToProps)(SearchBar));
