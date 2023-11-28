import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import debounce from 'lodash/debounce';

import ComparisonHeaderCell from './ComparisonHeaderCell';
import SystemHeaderCells from './SystemHeaderCells';
import SortIcon from './SortIcon';

const ComparisonHeader = ({
    factSort,
    fetchCompare,
    masterList,
    permissions,
    referenceId,
    removeSystem,
    selectHistoricProfiles,
    setColumnHeaderWidth,
    setHistory,
    stateSort,
    systemIds,
    toggleFactSort,
    toggleStateSort,
    updateReferenceId
}) => {
    const columnWidth = useRef();
    const [ refState, setRefState ] = useState(null);

    const setColumnWidth = () => {
        if (columnWidth?.current) {
            setColumnHeaderWidth(columnWidth.current.offsetWidth);
            setRefState({ refState: columnWidth });
        }
    };

    useEffect(() => {
        setColumnWidth();
        window.addEventListener('resize', debounce(setColumnWidth, 250));

        return () => {
            window.removeEventListener('resize', debounce(setColumnWidth, 250));
        };
    }, []);

    useEffect(() => {
        if (refState === null && columnWidth?.current !== null) {
            setColumnWidth();
        }
    }, [ refState, columnWidth.current ]);

    const toggleSort = async (sortType, sort) => {
        if (sortType === 'fact') {
            await toggleFactSort(sort);
        } else {
            await toggleStateSort(sort);
        }

        setHistory();
    };

    return (
        <tr className="sticky-column-header" data-ouia-component-type='PF4/TableRow' data-ouia-component-id='comparison-table-header-row'>
            <ComparisonHeaderCell
                classname="fact-header sticky-column fixed-column-1 pointer sticky-header"
                key='fact-header'
                id={ factSort }
                clickFunc={ () => toggleSort('fact', factSort) }
                ouiaType="PF4/Button"
                ouiaId="fact-sort-button"
            >
                <SortIcon classname='active-blue' type='Fact' sort={ factSort } />
            </ComparisonHeaderCell>
            <ComparisonHeaderCell
                classname="state-header sticky-column fixed-column-2 pointer right-border sticky-header"
                key='state-header'
                id={ stateSort || 'disabled' }
                clickFunc={ () => toggleSort('state', stateSort) }
                ouiaType='PF4/Button'
                ouiaId='state-sort-button'
            >
                <SortIcon classname={ stateSort !== '' ? 'active-blue' : '' } type='State' sort={ stateSort } />
            </ComparisonHeaderCell>
            { masterList.length
                ? <SystemHeaderCells
                    columnWidth={ columnWidth }
                    fetchCompare={ fetchCompare }
                    masterList={ masterList }
                    permissions={ permissions }
                    referenceId={ referenceId }
                    removeSystemFunc={ removeSystem }
                    selectHistoricProfiles={ selectHistoricProfiles }
                    systemIds={ systemIds }
                    updateReferenceId={ updateReferenceId }
                />
                : [ <td key='loading-systems-header'><Skeleton size={ SkeletonSize.md } /></td> ]
            }
        </tr>
    );
};

ComparisonHeader.propTypes = {
    factSort: PropTypes.string,
    fetchCompare: PropTypes.func,
    hasHSPReadPermissions: PropTypes.bool,
    masterList: PropTypes.array,
    permissions: PropTypes.object,
    referenceId: PropTypes.string,
    removeSystem: PropTypes.func,
    stateSort: PropTypes.string,
    systemIds: PropTypes.array,
    toggleFactSort: PropTypes.func,
    toggleStateSort: PropTypes.func,
    updateReferenceId: PropTypes.func,
    setHistory: PropTypes.func,
    selectHistoricProfiles: PropTypes.func,
    selectedBaselineIds: PropTypes.array,
    columnWidth: PropTypes.number,
    setColumnHeaderWidth: PropTypes.func.isRequired
};

export default ComparisonHeader;
