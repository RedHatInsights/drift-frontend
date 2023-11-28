import React from 'react';
import PropTypes from 'prop-types';
import { TimesIcon } from '@patternfly/react-icons';

const RemoveSystemCell = ({
    removeSystemFunc,
    item
}) => {
    return (
        <div>
            <a
                onClick={ () => removeSystemFunc(item) }
                className='remove-system-icon'
                data-testid={ `remove-system-button-${item.id}` }
                data-ouia-component-type='PF4/Button'
                data-ouia-component-id={ `remove-system-button-${item.id}` }
            >
                <TimesIcon/>
            </a>
        </div>
    );
};

RemoveSystemCell.propTypes = {
    removeSystemFunc: PropTypes.func,
    item: PropTypes.object
};

export default RemoveSystemCell;
