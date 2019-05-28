import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { compareActions } from '../../modules';
import { Pagination, dropDirection } from '@patternfly/react-core';

const perPageOptions = [ 10, 20, 50, 100 ];

class TablePagination extends Component {
    constructor(props) {
        super(props);

        this.onSetPage = this.onSetPage.bind(this);
        this.onPerPageSelect = this.onPerPageSelect.bind(this);
    }

    onSetPage(page) {
        const { perPage } = this.props;
        const pagination = { page, perPage };
        this.props.updatePagination(pagination);
    }

    onPerPageSelect(perPage) {
        const page = 1;
        const pagination = { page, perPage };
        this.props.updatePagination(pagination);
    }

    render() {
        return (
            <Pagination
                numberOfItems={ this.props.totalFacts }
                perPageOptions={ perPageOptions }
                page={ this.props.page }
                itemsPerPage={ this.props.perPage }
                direction={ dropDirection.down }
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
        page: state.compareReducer.page,
        perPage: state.compareReducer.perPage,
        totalFacts: state.compareReducer.totalFacts
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updatePagination: ((pagination) => dispatch(compareActions.updatePagination(pagination)))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TablePagination);
