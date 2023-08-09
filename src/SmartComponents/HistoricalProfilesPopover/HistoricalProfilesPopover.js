import React, { useState, useEffect } from 'react';
import { Badge, Button, Popover } from '@patternfly/react-core';
import { useDispatch, useSelector } from 'react-redux';
import { ExclamationCircleIcon, HistoryIcon, UndoIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

import systemsTableActions from '../SystemsTable/actions';
import HistoricalProfilesCheckbox from './HistoricalProfilesCheckbox/HistoricalProfilesCheckbox';
import api from '../../api';
import EmptyStateDisplay from '../EmptyStateDisplay/EmptyStateDisplay';
import HistoricalProfilesRadio from './HistoricalProfilesRadio/HistoricalProfilesRadio';
import addSystemModalActions from '../AddSystemModal/redux/actions';

const HistoricalProfilesPopover = ({
    badgeCount,
    fetchCompare,
    hasBadge,
    hasCompareButton,
    hasMultiSelect,
    referenceId,
    selectedBaselineIds,
    selectHistoricProfiles,
    selectSystem,
    system,
    systemIds,
    systemName
}) => {
    const dispatch = useDispatch();
    const selectedHSPIds = useSelector(({ historicProfilesState }) => historicProfilesState.selectedHSPIds);
    const [ historicalData, setHistoricalData ] = useState();
    const [ isLoading, setIsLoading ] = useState(true);
    const [ localBadgeCount, setLocalBadgeCount ] = useState(badgeCount ? badgeCount : 0);
    const [ error, setError ] = useState();

    const hasHistoricalData = () => {
        return historicalData && historicalData.profiles.length > 0;
    };

    const onSelect = async (checked, profile) => {
        let newSelectedHSPIds = [ ...selectedHSPIds ];

        if (profile.captured_date === 'Latest') {
            await selectSystem(profile.id, !checked);
        } else {
            if (newSelectedHSPIds.includes(profile.id)) {
                newSelectedHSPIds = newSelectedHSPIds.filter(hsp => hsp !== profile.id);
            } else {
                newSelectedHSPIds.push(profile.id);
            }

            await selectHistoricProfiles(newSelectedHSPIds);
        }

        dispatch(addSystemModalActions.handleHSPSelection(profile));
    };

    const onSingleSelect = async (profile) => {
        if (profile.captured_date === 'Latest') {
            await selectSystem(profile.id, true);
        }

        systemsTableActions.selectSingleHSP(profile);
    };

    const updateBadgeCount = () => {
        setLocalBadgeCount(historicalData?.profiles.filter((hsp) => {
            return selectedHSPIds.includes(hsp.id);
        }).length);
    };

    /*eslint-disable camelcase*/
    const fetchData = async () => {
        setIsLoading(true);
        let fetchedData = await api.fetchHistoricalData(system.system_id ? system.system_id : system.id);
        setIsLoading(false);

        fetchedData.profiles?.forEach(function(profile) {
            profile.system_name = systemName;
        });

        if (fetchedData.status) {
            setError({ status: fetchedData.status, message: fetchedData.data.message });
        } else {
            fetchedData.profiles.shift();
            setHistoricalData(fetchedData);
        }
    };
    /*eslint-enable camelcase*/

    const createDropdownArray = () => {
        let dropdownItems = [];

        if (isLoading) {
            for (let i = 0; i < 3; i += 1) {
                dropdownItems.push(
                    <React.Fragment>
                        <Skeleton
                            size={ SkeletonSize.sm }
                            key={ 'skeleton-row-' + i }
                        />
                        <br className='hsp-dropdown-loading' />
                    </React.Fragment>
                );
            }
        } else {
            if (hasHistoricalData()) {
                historicalData.profiles.forEach(function(profile, index) {
                    dropdownItems.push(
                        <div className={ index > 0 ? 'sm-padding-top' : null }>
                            { hasMultiSelect
                                ? <HistoricalProfilesCheckbox
                                    profile={ profile }
                                    updateBadgeCount={ updateBadgeCount }
                                    onSelect={ onSelect }
                                    selectedHSPIds={ selectedHSPIds }
                                />
                                : <HistoricalProfilesRadio
                                    profile={ profile }
                                    onSingleSelect={ onSingleSelect }
                                    selectedHSPIds={ selectedHSPIds }
                                />
                            }
                        </div>
                    );
                });
            } else if (error) {
                dropdownItems.push(
                    <EmptyStateDisplay
                        icon={ ExclamationCircleIcon }
                        isSmall={ true }
                        color='#c9190b'
                        title={ 'Cannot get historical check-ins' }
                        error={ error.status + ': ' + error.message }
                        button={ <a onClick={ () => fetchData() }>
                            <UndoIcon className='reload-button' />
                                Retry
                        </a> }
                    />
                );
            } else {
                dropdownItems.push(
                    <div>
                        There are no historical profiles to display.
                    </div>
                );
            }
        }

        return dropdownItems;
    };

    const [ isVisible, setIsVisible ] = useState(false);
    const [ dropDownArray, setDropDownArray ] = useState(createDropdownArray());

    const runFetchCompare = () => {
        fetchCompare(systemIds, selectedBaselineIds, selectedHSPIds, referenceId);
    };

    const onToggle = () => {
        if (isVisible === false) {
            fetchData();
        }

        setIsVisible(!isVisible);
    };

    const renderBadge = () => {
        if (localBadgeCount > 0) {
            return <Badge key={ 1 }>{ localBadgeCount }</Badge>;
        } else {
            return null;
        }
    };

    useEffect(() => {
        updateBadgeCount();
        setDropDownArray(createDropdownArray());
    }, [ selectedHSPIds ]);

    useEffect(() => {
        setDropDownArray(createDropdownArray());
    }, [ historicalData, error ]);

    let id = system?.system_id ? system?.system_id : system?.id;

    return (
        <React.Fragment>
            <span
                className='hsp-icon-padding'
                data-ouia-component-id={ 'hsp-popover-toggle-' + id  }
                data-ouia-component-type='PF4/Button' >
                <Popover
                    id={ 'hsp-popover-' + id }
                    isVisible={ isVisible }
                    shouldClose={ () => onToggle() }
                    headerContent={ <div>Historical profiles for this system</div> }
                    bodyContent={ <div style={{ maxHeight: '350px', overflowY: 'scroll' }}>
                        { dropDownArray }
                    </div> }
                    footerContent={ hasCompareButton
                        ? <Button
                            variant='primary'
                            ouiaId="hsp-popover-compare"
                            isDisabled={ !hasHistoricalData() }
                            onClick={ () => runFetchCompare() }>
                            Compare
                        </Button>
                        : null }
                >
                    <HistoryIcon className='hsp-dropdown-icon' onClick={ () => onToggle() } />
                </Popover>
            </span>
            { hasBadge ? renderBadge() : null }
        </React.Fragment>
    );
};

HistoricalProfilesPopover.propTypes = {
    badgeCount: PropTypes.number,
    fetchCompare: PropTypes.func,
    handleHSPSelection: PropTypes.func,
    hasBadge: PropTypes.bool,
    hasCompareButton: PropTypes.bool,
    hasMultiSelect: PropTypes.bool,
    referenceId: PropTypes.string,
    selectedBaselineIds: PropTypes.array,
    selectedHSPIds: PropTypes.array,
    selectHistoricProfiles: PropTypes.func,
    selectSingleHSP: PropTypes.func,
    selectSystem: PropTypes.func,
    system: PropTypes.object,
    systemIds: PropTypes.array,
    systemName: PropTypes.string
};

export default HistoricalProfilesPopover;
