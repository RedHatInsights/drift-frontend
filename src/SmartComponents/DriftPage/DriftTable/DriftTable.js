import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { AngleDownIcon, AngleRightIcon } from '@patternfly/react-icons';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

import AddSystemModal from '../../AddSystemModal/AddSystemModal';
import StateIcon from '../../StateIcon/StateIcon';
import ComparisonHeader from './ComparisonHeader/ComparisonHeader';
import { setHistory } from '../../../Utilities/SetHistory';

import { compareActions } from '../../modules';
import { baselinesTableActions } from '../../BaselinesTable/redux';
import { historicProfilesActions } from '../../HistoricalProfilesPopover/redux';

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
        this.fetchCompare = this.fetchCompare.bind(this);
        this.removeSystem = this.removeSystem.bind(this);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();

        if (this.systemIds.length > 0 || this.baselineIds.length > 0 || this.HSPIds.length > 0) {
            this.fetchCompare(this.systemIds, this.baselineIds, this.HSPIds, this.props.referenceId);
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
            if (historicalGroups.hasOwnProperty(hsp.system_id)) {
                historicalGroups[hsp.system_id].push(hsp);
            } else {
                historicalGroups[hsp.system_id] = [ hsp ];
            }
        });

        fullHistoricalSystemList = systems;

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

    setSystemIds() {
        this.systemIds = queryString.parse(this.props.location.search).system_ids;
        this.systemIds = Array.isArray(this.systemIds) ? this.systemIds : [ this.systemIds ];
        this.systemIds = this.systemIds.filter(item => item !== undefined);
    }

    setBaselineIds() {
        this.baselineIds = queryString.parse(this.props.location.search).baseline_ids;
        this.baselineIds = Array.isArray(this.baselineIds) ? this.baselineIds : [ this.baselineIds ];
        this.baselineIds = this.baselineIds.filter(item => item !== undefined);
        this.props.setSelectedBaselines(this.baselineIds, 'CHECKBOX');
    }

    setHSPIds() {
        const { selectHistoricProfiles } = this.props;

        this.HSPIds = queryString.parse(this.props.location.search).hsp_ids;
        this.HSPIds = Array.isArray(this.HSPIds) ? this.HSPIds : [ this.HSPIds ];
        this.HSPIds = this.HSPIds.filter(item => item !== undefined);
        selectHistoricProfiles(this.HSPIds);
    }

    setReferenceId() {
        const { location, updateReferenceId } = this.props;
        updateReferenceId(queryString.parse(location.search).reference_id);
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
        const { historicalProfiles, isFirstReference, referenceId, selectHistoricProfiles, setIsFirstReference } = this.props;
        let newReferenceId;

        if (item.type === 'system') {
            this.systemIds = this.systemIds.filter(id => id !== item.id);
            newReferenceId = await this.findHSPReference();

            this.HSPIds = await historicalProfiles.filter((profile) => {
                return profile.system_id !== item.id;
            }).map(profile => profile.id);

        } else if (item.type === 'baseline') {
            this.baselineIds = this.baselineIds.filter(id => id !== item.id);
        } else if (item.type === 'historical-system-profile') {
            this.HSPIds = this.HSPIds.filter(id => id !== item.id);
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

    fetchCompare(systemIds, baselineIds, HSPIds, referenceId) {
        const { clearComparison, fetchCompare, isFirstReference, setIsFirstReference, setSelectedBaselines, updateReferenceId } = this.props;
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

        setHistory(this.props.history, systemIds, baselineIds, HSPIds, reference);
        setSelectedBaselines(this.baselineIds, 'CHECKBOX');
        updateReferenceId(reference);

        if (systemIds.length || baselineIds.length || HSPIds.length || reference) {
            fetchCompare(systemIds, baselineIds, HSPIds, reference);
            setIsFirstReference(false);
        } else {
            clearComparison();
        }
    }

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

    findSystem(fact) {
        let row = [];
        let system = undefined;
        let className;

        this.masterList.forEach(item => {
            className = [ 'comparison-cell' ];
            system = fact.systems.find(function(sys) {
                return sys.id === item.id;
            });

            if (this.props.referenceId) {
                if (system.state === 'DIFFERENT') {
                    className.push('highlight');
                    className.push('different-fact-cell');
                }
            } else {
                if (fact.state === 'DIFFERENT') {
                    className.push('highlight');
                }
            }

            row.push(<td className={ className.join(' ') }>{ system.value === null ? 'No Data' : system.value }</td>);
        });

        return row;
    }

    renderRow(fact) {
        let row = [];
        let rows = [];

        if (fact.comparisons) {
            row.push(
                <td className={
                    this.props.expandedRows.includes(fact.name) ?
                        'nested-fact sticky-column fixed-column-1' :
                        'sticky-column fixed-column-1' }>
                    { this.renderExpandableRowButton(this.props.expandedRows, fact.name) } { fact.name }
                </td>
            );
            row.push(
                <td className="fact-state sticky-column fixed-column-2">
                    <StateIcon factState={ fact.state }/>
                </td>
            );

            this.masterList.forEach(() => {
                row.push(<td className="comparison-cell"></td>);
            });

            rows.push(<tr>{ row }</tr>);

            if (this.props.expandedRows.includes(fact.name)) {
                fact.comparisons.forEach(comparison => {
                    row = this.renderRowChild(comparison);
                    rows.push(<tr className={ comparison.state === 'DIFFERENT' ? 'unexpected-row' : '' }>{ row }</tr>);
                });
            }
        } else {
            row.push(<td className="sticky-column fixed-column-1">{ fact.name }</td>);
            row.push(
                <td className="fact-state sticky-column fixed-column-2">
                    <StateIcon factState={ fact.state }/>
                </td>
            );

            row = row.concat(this.findSystem(fact));

            rows.push(<tr className={ fact.state === 'DIFFERENT' ? 'unexpected-row' : '' }>{ row }</tr>);
        }

        return rows;
    }

    renderRowChild(fact) {
        let row = [];

        row.push(<td className="nested-fact sticky-column fixed-column-1">
            <p className="child-row">{ fact.name }</p>
        </td>);
        row.push(<td className="fact-state sticky-column fixed-column-2"><StateIcon factState={ fact.state }/></td>);

        row = row.concat(this.findSystem(fact));

        return row;
    }

    renderExpandableRowButton(expandedRows, factName) {
        let expandIcon;

        if (expandedRows.includes(factName)) {
            expandIcon = <AngleDownIcon className="carat-margin pointer active-blue" onClick={ () => this.props.expandRow(factName) } />;
        } else {
            expandIcon = <AngleRightIcon className="carat-margin pointer" onClick={ () => this.props.expandRow(factName) } />;
        }

        return expandIcon;
    }

    renderTable(compareData, loading) {
        const { factSort, referenceId, stateSort, toggleFactSort, toggleStateSort } = this.props;

        return (
            <React.Fragment>
                <div className="drift-table-wrapper">
                    <table className="pf-c-table pf-m-compact drift-table">
                        <thead>
                            <ComparisonHeader
                                factSort={ factSort }
                                fetchCompare={ this.fetchCompare }
                                masterList={ this.masterList }
                                referenceId={ referenceId }
                                removeSystem={ this.removeSystem }
                                stateSort={ stateSort }
                                systemIds={ this.systemIds }
                                toggleFactSort={ toggleFactSort }
                                toggleStateSort={ toggleStateSort }
                                updateReferenceId={ this.updateReferenceId }
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
        const { emptyState, filteredCompareData, systems, baselines, hasBaselinesReadPermissions, hasBaselinesWritePermissions,
            hasInventoryReadPermissions, historicalProfiles, loading } = this.props;

        this.masterList = this.formatEntities(systems, baselines, historicalProfiles);

        return (
            <React.Fragment>
                <AddSystemModal
                    selectedSystemIds={ systems.map(system => system.id) }
                    confirmModal={ this.fetchCompare }
                    referenceId={ this.props.referenceId }
                    hasInventoryReadPermissions={ hasInventoryReadPermissions }
                    hasBaselinesReadPermissions={ hasBaselinesReadPermissions }
                    hasBaselinesWritePermissions={ hasBaselinesWritePermissions }
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
        systems: state.compareState.systems,
        baselines: state.compareState.baselines,
        historicalProfiles: state.compareState.historicalProfiles,
        factSort: state.compareState.factSort,
        stateSort: state.compareState.stateSort,
        expandedRows: state.compareState.expandedRows,
        emptyState: state.compareState.emptyState,
        referenceId: state.compareState.referenceId
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
    hasInventoryReadPermissions: PropTypes.bool,
    hasBaselinesReadPermissions: PropTypes.bool,
    hasBaselinesWritePermissions: PropTypes.bool
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DriftTable));
