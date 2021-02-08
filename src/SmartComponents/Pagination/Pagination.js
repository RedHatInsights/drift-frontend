import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Pagination } from '@patternfly/react-core';

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
        const { total, page, perPage, isCompact, widgetId, variant, ouiaId } = this.props;

        return (
            <Pagination
                itemCount={ total ? total : 0 }
                widgetId={ widgetId }
                page={ total === 0 ? 0 : page }
                perPage={ perPage }
                variant={ variant }
                onSetPage={ this.onSetPage }
                onPerPageSelect={ this.onPerPageSelect }
                isCompact={ isCompact }
                ouiaId={ ouiaId }
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
    tableId: PropTypes.string,
    widgetId: PropTypes.string,
    variant: PropTypes.any,
    ouiaId: PropTypes.string
};

export default TablePagination;
