import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Card, CardBody, Toolbar, ToolbarGroup, ToolbarItem, PaginationVariant } from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import { baselinesTableActions } from '../BaselinesTable/redux';
import { compareActions } from '../modules';
import { setHistory } from '../../Utilities/SetHistory';

import DriftTable from './DriftTable/DriftTable';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import TablePagination from '../Pagination/Pagination';
import DriftToolbar from './DriftToolbar/DriftToolbar';
import DriftPageEmptyState from './DriftPageEmptyState';
import EmptyStateDisplay from '../EmptyStateDisplay/EmptyStateDisplay';
import AddSystemModal from '../AddSystemModal/AddSystemModal';
import { PermissionContext } from '../../App';
import { RegistryContext } from '../../Utilities/registry';
import { formatEntities } from './DriftTable/helpers';
import { ASC, DESC } from '../../constants';

import { useSearchParams } from 'react-router-dom';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

const DriftPage = ({
    title
}) => {
    const dispatch = useDispatch();
    const updatePagination = (pagination) => dispatch(compareActions.updatePagination(pagination));
    const updateReferenceId = (id) => dispatch(compareActions.updateReferenceId(id));
    const toggleFactSort = (direction) => dispatch(compareActions.toggleFactSort(direction));
    const toggleStateSort = (direction) => dispatch(compareActions.toggleStateSort(direction));

    const page = useSelector(({ compareState }) => compareState.page);
    const perPage = useSelector(({ compareState }) => compareState.perPage);
    const totalFacts = useSelector(({ compareState }) => compareState.totalFacts);
    const error = useSelector(({ compareState }) => compareState.error);
    const loading = useSelector(({ compareState }) => compareState.loading);
    const emptyState = useSelector(({ compareState }) => compareState.emptyState);
    const selectedHSPIds = useSelector(({ historicProfilesState }) => historicProfilesState.selectedHSPIds);
    const previousStateSystems = useSelector(({ compareState }) => compareState.previousStateSystems);
    const factFilter = useSelector(({ compareState }) => compareState.factFilter);
    const factTypeFilters = useSelector(({ compareState }) => compareState.factTypeFilters);
    const stateFilters = useSelector(({ compareState }) => compareState.stateFilters);
    const activeFactFilters = useSelector(({ compareState }) => compareState.activeFactFilters);
    const factSort = useSelector(({ compareState }) => compareState.factSort);
    const stateSort = useSelector(({ compareState }) => compareState.stateSort);
    const referenceId = useSelector(({ compareState }) => compareState.referenceId);
    const systems = useSelector(({ compareState }) => compareState.systems);
    const baselines = useSelector(({ compareState }) => compareState.baselines);
    const historicalProfiles = useSelector(({ compareState }) => compareState.historicalProfiles);
    const selectedBaselineIds = useSelector(({ baselinesTableState }) => baselinesTableState.comparisonTable.selectedBaselineIds);
    const exportStatus = useSelector(({ compareState }) => compareState.exportStatus);
    const filteredCompareData = useSelector(({ compareState }) => compareState.filteredCompareData);

    const [ searchParams ] = useSearchParams();
    const prevSearchParams = useRef();
    const navigate = useInsightsNavigate();
    const [ isFirstReference, setIsFirstReference ] = useState(true);
    const [ mainList, setMainList ] = useState(formatEntities(systems, baselines, historicalProfiles, referenceId));

    const addFilters = (newFilters, filters, addFunction, type) => {
        if (newFilters?.length > 0) {
            filters.forEach(function(filter) {
                let x = { ...filter };

                if (newFilters?.includes(filter.filter.toLowerCase())) {
                    x.selected = false;

                    if (type === 'fact') {
                        dispatch(addFunction(x));
                    }
                }

                if (type === 'state') {
                    dispatch(addFunction(x));
                }
            });
        }
    };

    const setFilters = () => {
        searchParams.get('filter[name]')?.split(',').forEach((factFilter) => {
            dispatch(compareActions.handleFactFilter(factFilter));
        });

        const newStateFilters = searchParams.get('filter[state]')?.split(',');
        const newFactTypeFilters = searchParams.get('filter[show]')?.split(',');

        addFilters(newStateFilters, stateFilters, compareActions.addStateFilter, 'state');
        addFilters(newFactTypeFilters, factTypeFilters, compareActions.toggleFactTypeFilter, 'fact');
    };

    const setSort = () => {
        let sort = searchParams.get('sort')?.split(',');

        sort?.forEach(function(sort) {
            if (sort.includes('fact')) {
                if (sort[0] === '-') {
                    toggleFactSort(ASC);
                } else {
                    toggleFactSort(DESC);
                }
            } else {
                if (sort[0] === '-') {
                    toggleStateSort(ASC);
                } else if (sort === 'state') {
                    toggleStateSort('');
                }
            }
        });

        if (sort?.length === 1 && sort[0]?.includes('fact')) {
            toggleStateSort(DESC);
        }
    };

    const handleSetIds = () => {
        return {
            systemIds: searchParams.getAll('system_ids'),
            baselineIds: searchParams.getAll('baseline_ids'),
            HSPIds: searchParams.getAll('hsp_ids'),
            refId: searchParams.get('reference_id')
        };
    };

    const useSetHistory = (
        systemIds = systems.map(system => system.id),
        baselineIds = baselines.map(baseline => baseline.id),
        HSPIds = historicalProfiles.map(hsp => hsp.id),
        refId = referenceId
    ) => {
        setHistory(
            navigate, systemIds, baselineIds, HSPIds, refId,
            activeFactFilters, factFilter, factTypeFilters, stateFilters, factSort, stateSort
        );
    };

    const handleFetchCompare = (sysIds = [], baseIds, hspIds, refId) => {
        let reference;

        if (isFirstReference) {
            if (!refId && baseIds.length) {
                reference = baseIds[0];
            } else if (refId) {
                reference = refId;
            }
        } else {
            reference = refId;
        }

        if (!sysIds.includes(reference) && !baseIds.includes(reference) && !hspIds.includes(reference)) {
            reference = undefined;
        }

        dispatch(baselinesTableActions.setSelectedBaselines(baseIds, 'COMPARISON'));
        dispatch(compareActions.updateReferenceId(reference));

        if (sysIds.length || baseIds.length || hspIds.length || reference) {
            dispatch(compareActions.fetchCompare(sysIds, baseIds, hspIds, reference));
            setIsFirstReference(false);
        } else {
            dispatch(compareActions.clearComparison());
        }

        useSetHistory(sysIds, baseIds, hspIds, reference);
    };

    useEffect(() => {
        document.title = title;

        setFilters();
        setSort();

        const { systemIds, baselineIds, HSPIds, refId } = handleSetIds();

        if (systemIds?.length || baselineIds?.length || HSPIds?.length) {
            handleFetchCompare(systemIds, baselineIds, HSPIds, refId);
        }
    }, []);

    useEffect(() => {
        setMainList(formatEntities(systems, baselines, historicalProfiles, referenceId));
    }, [ systems, baselines, historicalProfiles, referenceId ]);

    useEffect(() => {
        if (prevSearchParams !== '' && searchParams === '') {
            useSetHistory();
        }

        prevSearchParams.current = searchParams;
    }, [ searchParams ]);

    const onClose = () => {
        dispatch(compareActions.revertCompareData());
        setHistory(navigate, previousStateSystems.map(system => system.id));
    };

    return (
        <RegistryContext.Consumer>
            {
                registryContextValue =>
                    (<>
                        <PageHeader>
                            <PageHeaderTitle title='Comparison'/>
                        </PageHeader>
                        <Main store={ registryContextValue?.registry.getStore() }>
                            <PermissionContext.Consumer>
                                { value =>
                                    value.permissions.compareRead === false
                                        ? <EmptyStateDisplay
                                            icon={ LockIcon }
                                            color='#6a6e73'
                                            title={ 'You do not have access to Drift comparison' }
                                            text={ [ 'Contact your organization administrator(s) for more information.' ] }
                                        />
                                        : <React.Fragment>
                                            <AddSystemModal
                                                selectedSystemIds={ systems.map(system => system.id) }
                                                confirmModal={ handleFetchCompare }
                                                referenceId={ referenceId }
                                                permissions={ value.permissions }
                                                updateReferenceId={ updateReferenceId }
                                            />
                                            <ErrorAlert
                                                error={ error }
                                                onClose={ onClose }
                                            />
                                            <DriftPageEmptyState emptyState={ emptyState } error={ error } loading={ loading } />
                                            <Card className='pf-t-light pf-m-opaque-100'>
                                                <CardBody>
                                                    { !emptyState &&
                                                        <React.Fragment>
                                                            <DriftToolbar
                                                                loading={ loading }
                                                                history={ history }
                                                                page={ page }
                                                                perPage={ perPage }
                                                                totalFacts={ totalFacts }
                                                                setIsFirstReference={ setIsFirstReference }
                                                                factFilter={ factFilter }
                                                                factTypeFilters={ factTypeFilters }
                                                                stateFilters={ stateFilters }
                                                                activeFactFilters={ activeFactFilters }
                                                                setHistory={ useSetHistory }
                                                                exportStatus={ exportStatus }
                                                                store={ registryContextValue?.registry.getStore() }
                                                            />
                                                            <DriftTable
                                                                updateReferenceId={ updateReferenceId }
                                                                error={ error }
                                                                isFirstReference={ isFirstReference }
                                                                setIsFirstReference={ setIsFirstReference }
                                                                permissions={ value.permissions }
                                                                activeFactFilters={ activeFactFilters }
                                                                factFilter={ factFilter }
                                                                setHistory={ useSetHistory }
                                                                factSort={ factSort }
                                                                filteredCompareData={ filteredCompareData }
                                                                stateSort={ stateSort }
                                                                referenceId={ referenceId }
                                                                historicalProfiles={ historicalProfiles }
                                                                selectedSystemIds={ systems.map(system => system.id) }
                                                                selectedBaselineIds={ selectedBaselineIds }
                                                                selectedHSPIds={ selectedHSPIds }
                                                                handleFetchCompare={ handleFetchCompare }
                                                                mainList={ mainList }
                                                            />
                                                        </React.Fragment>
                                                    }
                                                    { !emptyState && !loading &&
                                                        <Toolbar className="drift-toolbar">
                                                            <ToolbarGroup className="pf-c-pagination">
                                                                <ToolbarItem>
                                                                    <TablePagination
                                                                        page={ page }
                                                                        perPage={ perPage }
                                                                        total={ totalFacts }
                                                                        isCompact={ false }
                                                                        updatePagination={ updatePagination }
                                                                        widgetId='drift-pagination-bottom'
                                                                        ouiaId='drift-pagination-bottom'
                                                                        variant={ PaginationVariant.bottom }
                                                                    />
                                                                </ToolbarItem>
                                                            </ToolbarGroup>
                                                        </Toolbar>
                                                    }
                                                </CardBody>
                                            </Card>
                                        </React.Fragment>
                                }
                            </PermissionContext.Consumer>
                        </Main>
                    </>)}
        </RegistryContext.Consumer>
    );
};

DriftPage.propTypes = {
    activeFactFilters: PropTypes.array,
    baselines: PropTypes.array,
    emptyState: PropTypes.bool,
    error: PropTypes.object,
    exportStatus: PropTypes.string,
    factFilter: PropTypes.string,
    factSort: PropTypes.string,
    factTypeFilters: PropTypes.array,
    historicalProfiles: PropTypes.array,
    loading: PropTypes.bool,
    page: PropTypes.number,
    perPage: PropTypes.number,
    previousStateSystems: PropTypes.array,
    referenceId: PropTypes.string,
    selectedBaselineIds: PropTypes.array,
    stateFilters: PropTypes.array,
    stateSort: PropTypes.string,
    systems: PropTypes.array,
    title: PropTypes.string,
    totalFacts: PropTypes.number,
    updatePagination: PropTypes.func,
    updateReferenceId: PropTypes.func
};

export default DriftPage;
