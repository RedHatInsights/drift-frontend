import React from 'react';
import PropTypes from 'prop-types';
import { AngleDownIcon, AngleRightIcon } from '@patternfly/react-icons';

function RowFact(props) {
    const { expandedRows, expandRow, factName, type } = props;

    const buildClassName = () => {
        if (type === 'fact' || (type === 'category' && !expandedRows.includes(factName))) {
            return 'sticky-column fixed-column-1';
        } else {
            return 'nested-fact sticky-column fixed-column';
        }
    };

    const renderExpandableRowButton = () => {
        if (expandedRows.includes(factName)) {
            return <AngleDownIcon
                className={ 'carat-margin pointer active-blue' + (type === 'multi fact' ? ' child-row' : null) }
                data-ouia-component-type='PF4/Button'
                data-ouia-component-id={ 'expand-category-button-' + factName }
                onClick={ () => expandRow(factName) }
            />;
        } else {
            return <AngleRightIcon
                className={ 'carat-margin pointer' + (type === 'multi fact' ? ' child-row' : null) }
                data-ouia-component-type='PF4/Button'
                data-ouia-component-id={ 'expand-category-button-' + factName }
                onClick={ () => expandRow(factName) }
            />;
        }
    };

    const renderFact = () => {
        let fact;

        if (type === 'category' || type === 'multi fact') {
            let button = renderExpandableRowButton();
            fact = <span>{ button } { factName }</span>;
        } else if (type === 'sub fact') {
            fact = <p className='child-row'>{ factName }</p>;
        } else {
            fact = factName;
        }

        return fact;
    };

    return (
        <td className={ buildClassName() }>
            { renderFact() }
        </td>
    );
}

RowFact.propTypes = {
    expandedRows: PropTypes.array,
    expandRow: PropTypes.func,
    factName: PropTypes.string,
    type: PropTypes.string
};

export default RowFact;
