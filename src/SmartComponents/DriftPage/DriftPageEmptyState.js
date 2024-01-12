import React from 'react';
import PropTypes from 'prop-types';
import AddSystemButton from './AddSystemButton/AddSystemButton';
import { EmptyStateDisplay } from '../EmptyStateDisplay/EmptyStateDisplay';
import { ExclamationCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { EMPTY_COMPARISON_MESSAGE, EMPTY_COMPARISON_TITLE } from '../../constants';

const DriftPageEmptyState = ({ emptyState, error, loading }) => {
    const icon = error.status ? ExclamationCircleIcon : PlusCircleIcon;
    const color = error.status ? '#C9190B' : '#6A6E73';
    const title = error.status ? 'Comparison cannot be displayed' : EMPTY_COMPARISON_TITLE;

    return (
        emptyState && !loading &&
        <EmptyStateDisplay
            icon={ icon }
            color={ color }
            title={ title }
            text={ EMPTY_COMPARISON_MESSAGE }
            error={ error.status ? `Error ${error.status}: ${error.detail}` : null }
            button={ <AddSystemButton /> }
        />
    );
};

DriftPageEmptyState.propTypes = {
    emptyState: PropTypes.bool,
    error: PropTypes.object,
    loading: PropTypes.bool
};

export default DriftPageEmptyState;
