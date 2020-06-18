import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Pagination, DropdownDirection } from '@patternfly/react-core';

const perPageOptions = [
    { title: '10', value: 10 },
    { title: '25', value: 25 },
    { title: '50', value: 50 },
    { title: '100', value: 100 }
];

export class TablePagination extends Component {
    constructor(props) {
        super(props);

        this.onSetPage = this.onSetPage.bind(this);
        this.onPerPageSelect = this.onPerPageSelect.bind(this);
    }

    onSetPage(event, page) {
        const { tableId, updatePagination } = this.props;

        const { perPage } = this.props;
        const pagination = { page, perPage };
        tableId
            ? updatePagination(pagination, tableId)
            : updatePagination(pagination);
    }

    onPerPageSelect(event, perPage) {
        const { tableId, updatePagination } = this.props;

        const page = 1;
        const pagination = { page, perPage };
        tableId
            ? updatePagination(pagination, tableId)
            : updatePagination(pagination);
    }

    render() {
        const { total, page, perPage, isCompact } = this.props;

        return (
            <Pagination
                itemCount={ total ? total : 0 }
                perPageOptions={ perPageOptions }
                page={ total === 0 ? 0 : page }
                perPage={ perPage }
                dropDirection={ DropdownDirection.down }
                onSetPage={ this.onSetPage }
                onPerPageSelect={ this.onPerPageSelect }
                isCompact={ isCompact }
            />
        );
    }
}

TablePagination.propTypes = {
    perPage: PropTypes.number,
    page: PropTypes.number,
    updatePagination: PropTypes.func,
    total: PropTypes.number,
    isCompact: PropTypes.bool,
    tableId: PropTypes.string
};

export default TablePagination;
