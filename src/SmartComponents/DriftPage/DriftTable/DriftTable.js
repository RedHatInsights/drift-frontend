import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { ASC, DESC } from '../../../constants';

import AddSystemModal from '../../AddSystemModal/AddSystemModal';
import ComparisonHeader from './ComparisonHeader/ComparisonHeader';

import { compareActions } from '../../modules';
import { baselinesTableActions } from '../../BaselinesTable/redux';
import { historicProfilesActions } from '../../HistoricalProfilesPopover/redux';
import DriftTableRow from './DriftTableRow/DriftTableRow';

export class DriftTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            emptyStateMessage: [
                'You currently have no system or baselines displayed. Add at least two',
                'systems or baselines to compare their facts.'
            ]
        };

        this.masterList = [];

        this.setSystemIds();
        this.setBaselineIds();
        this.setHSPIds();
        this.setReferenceId();
        this.setFilters();
        this.setSort();
        this.topScroller = React.createRef();
        this.bottomScroller = React.createRef();
        this.doubleScroll = this.doubleScroll.bind(this);
        this.fetchCompare = this.fetchCompare.bind(this);
        this.removeSystem = this.removeSystem.bind(this);
    }

    doubleScroll() {
        let wrapper1 = this.topScroller.current;
        let wrapper2 = this.bottomScroller.current;

        wrapper1.onscroll = function() {
            wrapper2.scrollLeft = wrapper1.scrollLeft;
        };

        wrapper2.onscroll = function() {
            wrapper1.scrollLeft = wrapper2.scrollLeft;
        };
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();

        if (this.systemIds.length > 0 || this.baselineIds.length > 0 || this.HSPIds.length > 0) {
            await this.fetchCompare(this.systemIds, this.baselineIds, this.HSPIds, this.props.referenceId);
        }
    }

    async shouldComponentUpdate(nextProps) {
        if (!nextProps.emptyState) {
            await window.insights?.chrome?.appAction?.('comparison-view');
        }
    }

    shiftReferenceToFront = (masterList) => {
        let index;
        let systemToMove;

        index = masterList.findIndex((item) => {
            return item.id === this.props.referenceId;
        });

        systemToMove = masterList.splice(index, 1);
        masterList.unshift(systemToMove[0]);

        return masterList;
    }

    formatEntities(systems, baselines, historicalProfiles) {
        /*eslint-disable camelcase*/
        let fullHistoricalSystemList = [];
        let historicalGroups = {};
        let masterList;

        if (systems.length === 0 && baselines.length === 0 && historicalProfiles.length === 0) {
            return [];
        }

        systems = systems.map(function(system) {
            system.type = 'system';
            return system;
        });
        baselines = baselines.map(function(baseline) {
            baseline.type = 'baseline';
            return baseline;
        });
        historicalProfiles = historicalProfiles.map(function(hsp) {
            hsp.type = 'historical-system-profile';
            return hsp;
        });

        historicalProfiles.forEach(function(hsp) {
            if (Object.prototype.hasOwnProperty.call(historicalGroups, hsp.system_id)) {
                historicalGroups[hsp.system_id].push(hsp);
            } else {
                historicalGroups[hsp.system_id] = [ hsp ];
            }
        });

        fullHistoricalSystemList = systems;

        // eslint-disable-next-line no-unused-vars
        for (const [ system_id, hsps ] of Object.entries(historicalGroups)) {
            let system = systems.find(item => system_id === item.id);
            let index;

            if (system !== undefined) {
                index = fullHistoricalSystemList.indexOf(system);
                fullHistoricalSystemList = [
                    ...fullHistoricalSystemList.slice(0, index + 1),
                    ...hsps,
                    ...fullHistoricalSystemList.slice(index + 1, fullHistoricalSystemList.length)
                ];
            } else {
                fullHistoricalSystemList = fullHistoricalSystemList.concat(hsps);
            }
        }
        /*eslint-enable camelcase*/

        masterList = baselines.concat(fullHistoricalSystemList);

        if (this.props.referenceId) {
            masterList = this.shiftReferenceToFront(masterList);
        }

        return masterList;
    }

    /*eslint-disable*/
    setSystemIds() {
        let searchParams = new URLSearchParams(this.props.location.search);

        this.systemIds = searchParams.getAll('system_ids');
        if (!this.systemIds.length) {
            this.systemIds = this.props.systems.map(system => system.id);
        } else {
            this.systemIds = Array.isArray(this.systemIds) ? this.systemIds : [ this.systemIds ];
            this.systemIds = this.systemIds.filter(item => item !== undefined);
        }
    }

    setBaselineIds() {
        let searchParams = new URLSearchParams(this.props.location.search);

        this.baselineIds = searchParams.getAll('baseline_ids');
        if (!this.baselineIds.length) {
            this.baselineIds = this.props.baselines.map(baseline => baseline.id);
        } else {
            this.baselineIds = Array.isArray(this.baselineIds) ? this.baselineIds : [ this.baselineIds ];
            this.baselineIds = this.baselineIds.filter(item => item !== undefined);
            this.props.setSelectedBaselines(this.baselineIds, 'COMPARISON');
        }
    }

    setHSPIds() {
        const { location, selectHistoricProfiles } = this.props;
        let searchParams = new URLSearchParams(location.search);

        this.HSPIds = searchParams.getAll('hsp_ids');
        if (!this.HSPIds.length) {
            this.HSPIds = this.props.historicalProfiles.map(hsp => hsp.id);
        } else {
            this.HSPIds = Array.isArray(this.HSPIds) ? this.HSPIds : [ this.HSPIds ];
            this.HSPIds = this.HSPIds.filter(item => item !== undefined);
            selectHistoricProfiles(this.HSPIds);
        }
    }

    setReferenceId() {
        const { location, updateReferenceId } = this.props;
        let searchParams = new URLSearchParams(location.search);
        let referenceId = searchParams.get('reference_id');

        if (referenceId) {
            updateReferenceId(referenceId === null ? undefined : referenceId);
        }
    }

    setFilters() {
        const { addStateFilter, handleFactFilter, location, stateFilters } = this.props;
        let searchParams = new URLSearchParams(location.search);

        searchParams.get('filter[name]')?.split(',').forEach(function(factFilter) {
            handleFactFilter(factFilter);
        });

        let newStateFilters = searchParams.get('filter[state]')?.split(',');

        if (newStateFilters?.length > 0) {
            stateFilters.forEach(function(stateFilter) {
                let filter = { ...stateFilter };

                if (newStateFilters?.includes(stateFilter.filter.toLowerCase())) {
                    filter.selected = false;
                }

                addStateFilter(filter);
            });
        }
    }

    setSort() {
        const { location, toggleFactSort, toggleStateSort } = this.props;
        let searchParams = new URLSearchParams(location.search);

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
    }

    updateReferenceId = (id) => {
        this.fetchCompare(this.systemIds, this.baselineIds, this.HSPIds, id);
    }

    findHSPReference = () => {
        const { referenceId } = this.props;
        let newReferenceId = referenceId;

        this.HSPIds.forEach((id) => {
            if (id === referenceId) {
                newReferenceId = undefined;
            }
        });

        return newReferenceId;
    }

    async removeSystem(item) {
        const { handleBaselineSelection, handleHSPSelection, handleSystemSelection, historicalProfiles, isFirstReference,
            referenceId, selectHistoricProfiles, setIsFirstReference } = this.props;
        let newReferenceId = referenceId;

        if (item.type === 'system') {
            this.systemIds = this.systemIds.filter(id => id !== item.id);
            newReferenceId = await this.findHSPReference();
            handleSystemSelection([ item ], false);

            let hspsToRemove = historicalProfiles.filter(profile => profile.system_id === item.id);

            this.HSPIds = await historicalProfiles.filter((profile) => {
                return profile.system_id !== item.id;
            }).map(profile => profile.id);

            hspsToRemove.forEach(function(hsp) {
                handleHSPSelection(hsp);
            });
        } else if (item.type === 'baseline') {
            this.baselineIds = this.baselineIds.filter(id => id !== item.id);
            handleBaselineSelection([ item ], false);
        } else if (item.type === 'historical-system-profile') {
            this.HSPIds = this.HSPIds.filter(id => id !== item.id);
            handleHSPSelection(item);
        }

        if (item.id === newReferenceId) {
            newReferenceId = undefined;
        }

        selectHistoricProfiles(this.HSPIds);
        if (!this.systemIds.length && !this.baselineIds.length
            && !this.HSPIds.length && !referenceId && !isFirstReference) {
            setIsFirstReference(true);
        }

        this.fetchCompare(this.systemIds, this.baselineIds, this.HSPIds, newReferenceId);

    }

    async fetchCompare(systemIds = [], baselineIds, HSPIds, referenceId) {
        const { clearComparison, fetchCompare, isFirstReference, setHistory, setIsFirstReference, setSelectedBaselines, updateReferenceId } = this.props;
        let reference;

        this.systemIds = systemIds;
        this.baselineIds = baselineIds;
        this.HSPIds = HSPIds;

        if (isFirstReference) {
            if (!referenceId && this.baselineIds.length) {
                reference = baselineIds[0];
            } else if (referenceId) {
                reference = referenceId;
            }
        } else {
            reference = referenceId;
        }

        if (!systemIds.includes(reference) && !baselineIds.includes(reference) && !HSPIds.includes(reference)) {
            reference = undefined;
        }

        setSelectedBaselines(this.baselineIds, 'COMPARISON');
        updateReferenceId(reference);

        if (systemIds.length || baselineIds.length || HSPIds.length || reference) {
            await fetchCompare(systemIds, baselineIds, HSPIds, reference);
            await setIsFirstReference(false);
        } else {
            await clearComparison();
        }

        setHistory();
    }
    /*eslint-enable*/

    renderRows(facts) {
        let rows = [];

        if (facts !== undefined) {
            facts.forEach(fact => {
                rows.push(this.renderRow(fact));
            });
        }

        return rows;
    }

    renderLoadingRows() {
        let rows = [];
        let rowData = [];

        for (let i = 0; i < 3; i += 1) {
            rowData.push(<td><Skeleton size={ SkeletonSize.md } /></td>);
        }

        for (let i = 0; i < 10; i += 1) {
            rows.push(<tr>{ rowData }</tr>);
        }

        return rows;
    }

    renderRow(fact) {
        const { expandedRows, expandRow, referenceId, stateSort } = this.props;
        let rows = [];

        if (fact.comparisons) {
            rows.push(<DriftTableRow
                expandedRows={ expandedRows }
                expandRow={ expandRow }
                fact={ fact }
                masterList={ this.masterList }
                referenceId={ referenceId }
                stateSort={ stateSort }
                type={ 'category' }
            />);

            if (expandedRows.includes(fact.name)) {
                fact.comparisons.forEach(comparison => {
                    if (comparison.multivalues) {
                        rows.push(<DriftTableRow
                            expandedRows={ expandedRows }
                            expandRow={ expandRow }
                            fact={ comparison }
                            masterList={ this.masterList }
                            referenceId={ referenceId }
                            stateSort={ stateSort }
                            type={ 'multi fact' }
                        />);

                        if (expandedRows.includes(comparison.name)) {
                            comparison.multivalues.forEach(subFactItem => {
                                rows.push(<DriftTableRow
                                    expandedRows={ expandedRows }
                                    fact={ subFactItem }
                                    masterList={ this.masterList }
                                    referenceId={ referenceId }
                                    stateSort={ stateSort }
                                    type={ 'multi value' }
                                />);
                            });
                        }
                    } else {
                        rows.push(<DriftTableRow
                            expandedRows={ expandedRows }
                            fact={ comparison }
                            masterList={ this.masterList }
                            referenceId={ referenceId }
                            stateSort={ stateSort }
                            type={ 'sub fact' }
                        />);
                    }
                });
            }
        } else {
            rows.push(<DriftTableRow
                expandedRows={ expandedRows }
                fact={ fact }
                masterList={ this.masterList }
                referenceId={ referenceId }
                stateSort={ stateSort }
                type={ 'fact' }
            />);
        }

        return rows;
    }

    renderTable(compareData, loading) {
        const { factSort, permissions, referenceId, selectedBaselineIds, selectedHSPIds,
            selectHistoricProfiles, setHistory, stateSort, toggleFactSort, toggleStateSort } = this.props;
        let scrollWidth = '';

        if (this.bottomScroller.current) {
            scrollWidth = this.bottomScroller.current.scrollWidth;
        }

        return (
            <React.Fragment>
                <div className='second-scroll-wrapper' onScroll={ this.doubleScroll } ref={ this.topScroller }>
                    <div
                        className='second-scroll'
                        style={{ width: scrollWidth }}
                    ></div>
                </div>
                <div className="drift-table-wrapper" onScroll={ this.doubleScroll } ref={ this.bottomScroller }>
                    <table
                        className="pf-c-table pf-m-compact drift-table"
                        data-ouia-component-type='PF4/Table'
                        data-ouia-component-id='comparison-table'>
                        <thead>
                            <ComparisonHeader
                                factSort={ factSort }
                                fetchCompare={ this.fetchCompare }
                                permissions={ permissions }
                                masterList={ this.masterList }
                                referenceId={ referenceId }
                                removeSystem={ this.removeSystem }
                                stateSort={ stateSort }
                                systemIds={ this.systemIds }
                                toggleFactSort={ toggleFactSort }
                                toggleStateSort={ toggleStateSort }
                                updateReferenceId={ this.updateReferenceId }
                                setHistory={ setHistory }
                                selectedHSPIds={ selectedHSPIds }
                                selectHistoricProfiles={ selectHistoricProfiles }
                                selectedBaselineIds={ selectedBaselineIds }
                            />
                        </thead>
                        <tbody>
                            { loading ? this.renderLoadingRows() : this.renderRows(compareData) }
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const { emptyState, filteredCompareData, systems, baselines, historicalProfiles, loading, permissions,
            updateReferenceId } = this.props;

        this.masterList = this.formatEntities(systems, baselines, historicalProfiles);

        return (
            <React.Fragment>
                <AddSystemModal
                    selectedSystemIds={ systems.map(system => system.id) }
                    confirmModal={ this.fetchCompare }
                    referenceId={ this.props.referenceId }
                    permissions={ permissions }
                    updateReferenceId={ updateReferenceId }
                />
                { !emptyState
                    ? this.renderTable(filteredCompareData, loading)
                    : null
                }
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        addSystemModalOpened: state.addSystemModalState.addSystemModalOpened,
        fullCompareData: state.compareState.fullCompareData,
        filteredCompareData: state.compareState.filteredCompareData,
        loading: state.compareState.loading,
        expandedRows: state.compareState.expandedRows,
        emptyState: state.compareState.emptyState
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompare: ((systemIds, baselineIds, historicalProfiles, referenceId) =>
            dispatch(compareActions.fetchCompare(systemIds, baselineIds, historicalProfiles, referenceId))
        ),
        toggleFactSort: (sortType) => dispatch(compareActions.toggleFactSort(sortType)),
        toggleStateSort: (sortType) => dispatch(compareActions.toggleStateSort(sortType)),
        expandRow: (factName) => dispatch(compareActions.expandRow(factName)),
        setSelectedBaselines: ((selectedBaselineIds, tableId) =>
            dispatch(baselinesTableActions.setSelectedBaselines(selectedBaselineIds, tableId))
        ),
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds))
    };
}

DriftTable.propTypes = {
    addSystemModalOpened: PropTypes.bool,
    location: PropTypes.object,
    history: PropTypes.object,
    fetchCompare: PropTypes.func,
    fullCompareData: PropTypes.array,
    filteredCompareData: PropTypes.array,
    systems: PropTypes.array,
    baselines: PropTypes.array,
    historicalProfiles: PropTypes.array,
    factSort: PropTypes.string,
    stateSort: PropTypes.string,
    loading: PropTypes.bool,
    toggleFactSort: PropTypes.func,
    toggleStateSort: PropTypes.func,
    expandRow: PropTypes.func,
    expandedRows: PropTypes.array,
    setSelectedBaselines: PropTypes.func,
    selectHistoricProfiles: PropTypes.func,
    emptyState: PropTypes.bool,
    updateReferenceId: PropTypes.func,
    referenceId: PropTypes.string,
    error: PropTypes.object,
    isFirstReference: PropTypes.bool,
    setIsFirstReference: PropTypes.func,
    clearComparison: PropTypes.func,
    permissions: PropTypes.object,
    stateFilters: PropTypes.array,
    addStateFilter: PropTypes.func,
    handleFactFilter: PropTypes.func,
    activeFactFilters: PropTypes.array,
    factFilter: PropTypes.string,
    setHistory: PropTypes.func,
    selectedHSPIds: PropTypes.array,
    selectedBaselineIds: PropTypes.array,
    handleBaselineSelection: PropTypes.func,
    handleHSPSelection: PropTypes.func,
    handleSystemSelection: PropTypes.func,
    hasHSPReadPermissions: PropTypes.bool
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DriftTable));
