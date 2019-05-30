import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { compareActions } from '../../modules';
import { Pagination, DropdownDirection } from '@patternfly/react-core';

const perPageOptions = [
    { title: '10', value: 10 },
    { title: '25', value: 25 },
    { title: '50', value: 50 },
    { title: '100', value: 100 }
];

class TablePagination extends Component {
    constructor(props) {
        super(props);

        this.onSetPage = this.onSetPage.bind(this);
        this.onPerPageSelect = this.onPerPageSelect.bind(this);
    }

    onSetPage(event, page) {
        const { perPage } = this.props;
        const pagination = { page, perPage };
        this.props.updatePagination(pagination);
    }

    onPerPageSelect(event, perPage) {
        const page = 1;
        const pagination = { page, perPage };
        this.props.updatePagination(pagination);
    }

    render() {
        const { totalFacts, page, perPage } = this.props;

        return (
            <Pagination
                itemCount={ totalFacts }
                perPageOptions={ perPageOptions }
                page={ totalFacts === 0 ? 0 : page }
                perPage={ perPage }
                dropDirection={ DropdownDirection.down }
                onSetPage={ this.onSetPage }
                onPerPageSelect={ this.onPerPageSelect }
            />
        );
    }
}

TablePagination.propTypes = {
    perPage: PropTypes.number,
    page: PropTypes.number,
    updatePagination: PropTypes.func,
    totalFacts: PropTypes.number
};

function mapStateToProps(state) {
    return {
        page: state.compareState.page,
        perPage: state.compareState.perPage,
        totalFacts: state.compareState.totalFacts
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updatePagination: ((pagination) => dispatch(compareActions.updatePagination(pagination)))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TablePagination);
