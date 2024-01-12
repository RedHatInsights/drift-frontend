import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import ComparisonHeader from './ComparisonHeader/ComparisonHeader';
import { addSystemModalActions } from '../../AddSystemModal/redux';
import { historicProfilesActions } from '../../HistoricalProfilesPopover/redux';
import DriftTableRows from './DriftTableRow/DriftTableRows';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const DriftTable = ({
    factSort,
    filteredCompareData,
    handleFetchCompare,
    historicalProfiles,
    isFirstReference,
    mainList,
    permissions,
    referenceId,
    selectedBaselineIds,
    selectedHSPIds,
    selectedSystemIds,
    setHistory,
    setIsFirstReference,
    stateSort,
    toggleFactSort,
    toggleStateSort
}) => {
    const chrome = useChrome();
    const dispatch = useDispatch();
    const selectHistoricProfiles = (hspIds) => dispatch(historicProfilesActions.selectHistoricProfiles(hspIds));
    const loading = useSelector(({ compareState }) => compareState.loading);
    const expandedRows = useSelector(({ compareState }) => compareState.expandedRows);

    const [ columnHeaderWidth, setColumnHeaderWidth ] = useState(0);
    const [ scrollWidth, setScrollWidth ] = useState('');
    const topScroller = useRef(null);
    const headerScroll = useRef(null);
    const bottomScroller = useRef(null);

    useEffect(() => {
        if (bottomScroller.current) {
            setScrollWidth(bottomScroller.current.scrollWidth);
        }
    }, [ bottomScroller.current ]);

    const doubleScroll = () => {
        let wrapper1 = topScroller.current;
        let wrapper2 = headerScroll.current;
        let wrapper3 = bottomScroller.current;

        wrapper1.onscroll = function() {
            wrapper2.scrollLeft = wrapper1.scrollLeft;
            wrapper3.scrollLeft = wrapper1.scrollLeft;
        };

        wrapper3.onscroll = function() {
            wrapper1.scrollLeft = wrapper3.scrollLeft;
            wrapper2.scrollLeft = wrapper3.scrollLeft;
        };
    };

    useEffect(() => {
        chrome?.appAction('comparison-view');
    }, []);

    const handleUpdateReferenceId = async (id) => {
        handleFetchCompare(selectedSystemIds, selectedBaselineIds, selectedHSPIds, id);
    };

    const findHSPReference = () => {
        let newReferenceId = referenceId;

        selectedHSPIds.forEach((id) => {
            if (id === referenceId) {
                newReferenceId = undefined;
            }
        });

        return newReferenceId;
    };

    const removeSystem = async (item) => {
        let newReferenceId = referenceId;
        let newSelectedSystemIds = selectedSystemIds;
        let newSelectedBaselineIds = selectedBaselineIds;
        let newSelectedHSPIds = selectedHSPIds;

        if (item.type === 'system') {
            newSelectedSystemIds = selectedSystemIds.filter(id => id !== item.id);
            newReferenceId = await findHSPReference();
            dispatch(addSystemModalActions.handleSystemSelection([ item ], false));

            const hspsToRemove = historicalProfiles.filter(profile => profile.system_id === item.id);

            newSelectedHSPIds = historicalProfiles.filter((profile) => {
                return profile.system_id !== item.id;
            }).map(profile => profile.id);

            hspsToRemove.forEach(function(hsp) {
                dispatch(addSystemModalActions.handleHSPSelection(hsp));
            });
        } else if (item.type === 'baseline') {
            newSelectedBaselineIds = selectedBaselineIds.filter(id => id !== item.id);
            dispatch(addSystemModalActions.handleBaselineSelection([ item ], false));
        } else if (item.type === 'historical-system-profile') {
            newSelectedHSPIds = selectedHSPIds.filter(id => id !== item.id);
            dispatch(addSystemModalActions.handleHSPSelection(item));
        }

        if (item.id === newReferenceId) {
            newReferenceId = undefined;
        }

        selectHistoricProfiles(newSelectedHSPIds);
        if (!newSelectedSystemIds.length && !newSelectedBaselineIds.length
            && !newSelectedHSPIds.length && !newReferenceId && !isFirstReference) {
            setIsFirstReference(true);
        }

        handleFetchCompare(newSelectedSystemIds, newSelectedBaselineIds, newSelectedHSPIds, newReferenceId);
    };

    const renderLoadingRows = () => {
        let rows = [];
        let rowData = [];

        rowData.push(<td className='fact-loading-width'><Skeleton size={ SkeletonSize.md } /></td>);
        rowData.push(<td className='state-loading-width'><Skeleton size={ SkeletonSize.md } /></td>);
        rowData.push(<td><Skeleton size={ SkeletonSize.md } /></td>);

        for (let i = 0; i < 10; i += 1) {
            rows.push(<tr>{ rowData }</tr>);
        }

        return rows;
    };

    return (
        <React.Fragment>
            <div className='sticky-table-header'>
                <div className='second-scroll-wrapper' onScroll={ doubleScroll } ref={ topScroller }>
                    <div
                        className='second-scroll'
                        style={{ width: scrollWidth }}
                    ></div>
                </div>
                <div
                    className="drift-table-wrapper"
                    onScroll={ doubleScroll }
                    ref={ headerScroll }>
                    <table
                        className="pf-c-table pf-m-compact drift-table"
                        data-ouia-component-type='PF4/Table'
                        data-ouia-component-id='comparison-table'>
                        <thead>
                            <ComparisonHeader
                                factSort={ factSort }
                                fetchCompare={ handleFetchCompare }
                                permissions={ permissions }
                                mainList={ mainList }
                                referenceId={ referenceId }
                                removeSystem={ removeSystem }
                                stateSort={ stateSort }
                                systemIds={ selectedSystemIds }
                                toggleFactSort={ toggleFactSort }
                                toggleStateSort={ toggleStateSort }
                                updateReferenceId={ handleUpdateReferenceId }
                                setHistory={ setHistory }
                                selectHistoricProfiles={ selectHistoricProfiles }
                                setColumnHeaderWidth={ setColumnHeaderWidth }
                            />
                        </thead>
                    </table>
                </div>
            </div>
            <div
                className="drift-table-wrapper table-body-scroll"
                onScroll={ doubleScroll }
                ref={ bottomScroller }>
                <table
                    className="pf-c-table pf-m-compact drift-table"
                    data-ouia-component-type='PF4/Table'
                    data-ouia-component-id='comparison-table'>
                    <tbody>
                        { loading
                            ? renderLoadingRows()
                            : <DriftTableRows
                                columnWidth={ columnHeaderWidth }
                                expandedRows={ expandedRows }
                                filteredCompareData={ filteredCompareData }
                                mainList={ mainList }
                                referenceId={ referenceId }
                                stateSort={ stateSort }
                            />
                        }
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
};

DriftTable.propTypes = {
    factSort: PropTypes.string,
    filteredCompareData: PropTypes.array,
    handleFetchCompare: PropTypes.func,
    historicalProfiles: PropTypes.object,
    isFirstReference: PropTypes.bool,
    loading: PropTypes.bool,
    mainList: PropTypes.array,
    permissions: PropTypes.object,
    referenceId: PropTypes.string,
    selectedBaselineIds: PropTypes.array,
    selectedHSPIds: PropTypes.array,
    selectedSystemIds: PropTypes.array,
    setHistory: PropTypes.func,
    setIsFirstReference: PropTypes.func,
    stateSort: PropTypes.string,
    toggleFactSort: PropTypes.func,
    toggleStateSort: PropTypes.func
};

export default DriftTable;
