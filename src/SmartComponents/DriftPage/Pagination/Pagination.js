import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { compareActions } from '../../modules';
import { Pagination, dropDirection } from '@red-hat-insights/insights-frontend-components';

const perPageOptions = [ 10, 20, 50, 100 ];

export class TablePagination extends Component {
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
        const { page } = this.props;
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
                direction={ dropDirection.up }
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
    fullCompareData: PropTypes.object,
    totalFacts: PropTypes.number
};

function mapStateToProps(state) {
    return {
        page: state.compareReducer.page,
        perPage: state.compareReducer.perPage,
        fullCompareData: state.compareReducer.fullCompareData,
        totalFacts: state.compareReducer.totalFacts
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updatePagination: (pagination) => dispatch(compareActions.updatePagination(pagination))
    };
}

export default (connect(mapStateToProps, mapDispatchToProps)(TablePagination));
