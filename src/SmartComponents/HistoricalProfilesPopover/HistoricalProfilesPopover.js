import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Badge, Button, Popover } from '@patternfly/react-core';
import { ExclamationCircleIcon, HistoryIcon, UndoIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

import systemsTableActions from '../SystemsTable/actions';
import HistoricalProfilesCheckbox from './HistoricalProfilesCheckbox/HistoricalProfilesCheckbox';
import api from '../../api';
import EmptyStateDisplay from '../EmptyStateDisplay/EmptyStateDisplay';
import HistoricalProfilesRadio from './HistoricalProfilesRadio/HistoricalProfilesRadio';

export class HistoricalProfilesPopover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: false,
            historicalData: undefined,
            dropDownArray: this.renderLoadingRows(),
            badgeCount: this.props.badgeCount ? this.props.badgeCount : 0,
            error: undefined
        };

        this.onToggle = () => {
            const { isVisible } = this.state;

            if (isVisible === false) {
                this.fetchData(this.props.system);
            }

            this.setState({
                isVisible: !isVisible
            });
        };

        this.onSelect = this.onSelect.bind(this);
        this.onSingleSelect = this.onSingleSelect.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedHSPIds !== prevProps.selectedHSPIds) {
            this.updateBadgeCount();
            this.setState({ dropDownArray: this.createDropdownArray() });
        }
    }

    async onSelect(checked, profile) {
        const { selectHistoricProfiles, selectSystem, selectedHSPIds } = this.props;
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

        this.updateBadgeCount(!checked);
    }

    async onSingleSelect(profile) {
        const { selectHistoricProfiles, selectSystem, selectSingleHSP, updateColumns } = this.props;

        if (profile.captured_date === 'Latest') {
            await selectSystem(profile.id, true);
        } else {
            await selectHistoricProfiles([ profile.id ]);
        }

        updateColumns('display_selected_hsp');
        selectSingleHSP(profile);
    }

    fetchCompare = () => {
        const { systemIds, selectedBaselineIds, selectedHSPIds, referenceId, fetchCompare } = this.props;

        fetchCompare(systemIds, selectedBaselineIds, selectedHSPIds, referenceId);
    }

    async retryFetch() {
        const { system } = this.props;
        await this.setState({
            dropDownArray: this.renderLoadingRows()
        });
        this.fetchData(system);
    }

    async fetchData(system) {
        let fetchedData = await api.fetchHistoricalData(system.system_id ? system.system_id : system.id);

        if (fetchedData.status) {
            this.setState({
                error: { status: fetchedData.status, message: fetchedData.data.message }
            });
        } else {
            fetchedData.profiles.shift();

            this.setState({
                historicalData: fetchedData
            });
        }

        this.setState({
            dropDownArray: this.createDropdownArray()
        });
    }

    createDropdownArray = () => {
        const { hasMultiSelect, selectedHSPIds } = this.props;
        const { historicalData, error } = this.state;

        let dropdownItems = [];
        let badgeCountFunc = this.updateBadgeCount;
        let onSelectFunc = this.onSelect;
        let onSingleSelectFunc = this.onSingleSelect;

        if (historicalData && historicalData.profiles.length > 0) {
            historicalData.profiles.forEach(function(profile, index) {
                dropdownItems.push(
                    <div className={ index > 0 ? 'sm-padding-top' : null }>
                        { hasMultiSelect
                            ? <HistoricalProfilesCheckbox
                                profile={ profile }
                                updateBadgeCount={ badgeCountFunc }
                                onSelect={ onSelectFunc }
                                selectedHSPIds={ selectedHSPIds }
                            />
                            : <HistoricalProfilesRadio
                                profile={ profile }
                                onSingleSelect={ onSingleSelectFunc }
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
                    button={ <a onClick={ () => this.retryFetch() }>
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

        return dropdownItems;
    }

    renderLoadingRows() {
        let rows = [];

        for (let i = 0; i < 3; i += 1) {
            rows.push(
                <Skeleton
                    className='hsp-dropdown-loading'
                    size={ SkeletonSize.sm }
                    key={ 'skeleton-row-' + i }
                />
            );
        }

        return rows;
    }

    updateBadgeCount = () => {
        this.setState({
            badgeCount: this.state.historicalData?.profiles.filter((hsp) => {
                return this.props.selectedHSPIds.includes(hsp.id);
            }).length
        });
    }

    renderBadge = () => {
        const { badgeCount } = this.state;

        if (badgeCount > 0) {
            return <Badge key={ 1 }>{ badgeCount }</Badge>;
        } else {
            return null;
        }
    }

    render() {
        /*eslint-disable camelcase*/
        const { dropDownArray, isVisible } = this.state;
        const { hasBadge, hasCompareButton, system } = this.props;
        let id = system?.system_id ? system?.system_id : system?.id;
        /*eslint-enable camelcase*/

        return (
            <React.Fragment>
                <span
                    className='hsp-icon-padding historical-system-profile-popover'
                    data-ouia-component-id={ 'hsp-popover-toggle-' + id  }
                    data-ouia-component-type='PF4/Button' >
                    <Popover
                        id={ 'hsp-popover-' + id }
                        isVisible={ isVisible }
                        shouldClose={ () => this.onToggle() }
                        headerContent={ <div>Historical profiles for this system</div> }
                        bodyContent={ dropDownArray }
                        footerContent={ hasCompareButton
                            ? <Button
                                variant='primary'
                                ouiaId="hsp-popover-compare"
                                onClick={ () => this.fetchCompare() }>
                                Compare
                            </Button>
                            : null }
                    >
                        <HistoryIcon className='hsp-dropdown-icon' onClick={ () => this.onToggle() } />
                    </Popover>
                </span>
                { hasBadge ? this.renderBadge() : null }
            </React.Fragment>
        );
    }
}

HistoricalProfilesPopover.propTypes = {
    fetchHistoricalData: PropTypes.func,
    system: PropTypes.object,
    fetchCompare: PropTypes.func,
    systemIds: PropTypes.array,
    selectedHSPIds: PropTypes.array,
    selectedBaselineIds: PropTypes.array,
    selectHistoricProfiles: PropTypes.func,
    selectSystem: PropTypes.func,
    hasBadge: PropTypes.bool,
    hasCompareButton: PropTypes.bool,
    badgeCount: PropTypes.number,
    referenceId: PropTypes.string,
    dropdownDirection: PropTypes.string,
    hasMultiSelect: PropTypes.bool,
    selectSingleHSP: PropTypes.func,
    updateColumns: PropTypes.func
};

function mapStateToProps(state) {
    return {
        selectedHSPIds: state.historicProfilesState?.selectedHSPIds || [],
        selectedBaselineIds: state.baselinesTableState?.checkboxTable.selectedBaselineIds || []
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectSystem: (id, selected) => dispatch({
            type: 'SELECT_ENTITY',
            payload: { id, selected }
        }),
        selectSingleHSP: (profile) => dispatch(systemsTableActions.selectSingleHSP(profile)),
        updateColumns: (key) => dispatch(systemsTableActions.updateColumns(key))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HistoricalProfilesPopover));
