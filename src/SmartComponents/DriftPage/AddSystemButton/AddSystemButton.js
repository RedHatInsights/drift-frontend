import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { useDispatch } from 'react-redux';

import { addSystemModalActions } from '../../AddSystemModal/redux';

const AddSystemButton = ({ loading, isToolbar }) => {
    const dispatch = useDispatch();

    const handleButtonClick = () => {
        dispatch(addSystemModalActions.toggleAddSystemModal());
    };

    return (
        <Button
            variant='primary'
            onClick={ () => handleButtonClick() }
            isDisabled={ loading }
            ouiaId={ isToolbar ? 'add-to-comparison' : 'add-to-comparison-empty' }
            data-testid='add-to-comparison-button'
        >
            { isToolbar ? 'Add to comparison' : 'Add systems or baselines' }
        </Button>
    );
};

AddSystemButton.propTypes = {
    toggleAddSystemModal: PropTypes.func,
    isToolbar: PropTypes.bool,
    loading: PropTypes.bool
};
export default AddSystemButton;
