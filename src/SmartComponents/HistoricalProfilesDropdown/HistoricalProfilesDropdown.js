import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Badge, Dropdown, DropdownItem, DropdownToggle, DropdownPosition } from '@patternfly/react-core';
import { HistoryIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

import { historicProfilesActions } from '../HistoricalProfilesDropdown/redux';
import systemsTableActions from '../SystemsTable/actions';
import HistoricalProfilesCheckbox from './HistoricalProfilesCheckbox/HistoricalProfilesCheckbox';
import api from '../../api';
import FetchHistoricalProfilesButton from './FetchHistoricalProfilesButton/FetchHistoricalProfilesButton';
import HistoricalProfilesRadio from './HistoricalProfilesRadio/HistoricalProfilesRadio';

export class HistoricalProfilesDropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            historicalData: undefined,
            dropDownArray: this.renderLoadingRows(),
            badgeCount: this.props.badgeCount ? this.props.badgeCount : 0
        };

        this.onToggle = () => {
            const { isOpen } = this.state;

            if (isOpen === false) {
                this.fetchData(this.props.system);
            }

            this.setState({
                isOpen: !isOpen
            });
        };

        this.onSelect = this.onSelect.bind(this);
        this.onSingleSelect = this.onSingleSelect.bind(this);
    }

    /*componentDidUpdate(prevProps) {
        const { selectedHSPIds, selectedSystemIds, selectHistoricProfiles } = this.props;
        const { historicalData } = this.state;
        if (prevProps.selectedHSPIds.length > 0 && this.props.selectedHSPIds.length === 0) {
            this.setState({ badgeCount: 0 });
        }
        if (prevProps.selectedHSPIds !== selectedHSPIds && historicalData) {
            this.updateBadgeCount();
        }

        if (prevProps.selectedHSPIds.length > 0 && selectedSystemIds.length > 0) {
            selectHistoricProfiles([]);
        }
    }*/

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
            //selectHistoricProfiles([ profile.id ]);

            await selectHistoricProfiles(newSelectedHSPIds);
        }

        this.updateBadgeCount(!checked);
    }

    async onSingleSelect(profile) {
        const { selectHistoricProfiles, selectSystem, selectSingleHSP } = this.props;

        if (profile.captured_date === 'Latest') {
            await selectSystem(profile.id, true);
        } else {
            await selectHistoricProfiles([ profile.id ]);
        }

        selectSingleHSP(profile);
    }

    fetchCompare = () => {
        const { systemIds, selectedBaselineIds, selectedHSPIds, referenceId, fetchCompare } = this.props;

        fetchCompare(systemIds, selectedBaselineIds, selectedHSPIds, referenceId);
    }

    async fetchData(system) {
        let fetchedData = await api.fetchHistoricalData(system.system_id ? system.system_id : system.id);
        fetchedData.profiles.shift();

        this.setState({
            historicalData: fetchedData
        });

        this.setState({
            dropDownArray: this.createDropdownArray(this.state.historicalData)
        });
    }

    createDropdownArray = (historicalData) => {
        const { hasBadge, hasMultiSelect } = this.props;

        let dropdownItems = [];
        let badgeCountFunc = this.updateBadgeCount;

        if (historicalData.profiles.length > 0) {
            historicalData.profiles.forEach((profile) => {
                dropdownItems.push(
                    <DropdownItem>
                        { hasMultiSelect
                            ? <HistoricalProfilesCheckbox
                                profile={ profile }
                                updateBadgeCount={ badgeCountFunc }
                                onSelect={ this.onSelect }
                            />
                            : <HistoricalProfilesRadio
                                profile={ profile }
                                onSingleSelect={ this.onSingleSelect }
                            />
                        }
                    </DropdownItem>
                );
            });

            dropdownItems.push(
                <div className='hsp-button'>
                    { !hasBadge
                        ? <FetchHistoricalProfilesButton
                            fetchCompare={ this.fetchCompare }
                        />
                        : null
                    }
                </div>
            );
        } else {
            dropdownItems.push(
                <DropdownItem isDisabled>
                    There are no historical profiles to display.
                </DropdownItem>
            );
        }

        return dropdownItems;
    }

    renderLoadingRows() {
        let rows = [];

        for (let i = 0; i < 3; i += 1) {
            rows.push(
                <Skeleton
                    className='hsp-dropdown-loading hsp-button'
                    size={ SkeletonSize.sm }
                    key={ 'skeleton-row-' + i }
                />
            );
            rows.push(<br></br>);
        }

        return rows;
    }

    updateBadgeCount = (/*checked*/) => {
        this.setState({
            badgeCount: this.state.historicalData.profiles.filter((hsp) => {
                return this.props.selectedHSPIds.includes(hsp.id);
            }).length
        });
        /*let newBadgeCount = this.state.badgeCount;
        newBadgeCount += checked ? 1 : -1;

        this.setState({ badgeCount: newBadgeCount });*/
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
        const { isOpen, dropDownArray } = this.state;
        const { hasBadge } = this.props;

        return (
            <React.Fragment>
                <Dropdown
                    className='historical-system-profile-dropdown'
                    toggle={ <DropdownToggle
                        className='hsp-dropdown-icon'
                        iconComponent={ null }
                        onToggle={ this.onToggle }>
                        <HistoryIcon />
                    </DropdownToggle> }
                    isOpen={ isOpen }
                    isPlain
                    position={ DropdownPosition.right }
                    direction={ this.props.dropdownDirection }
                    dropdownItems={ dropDownArray }
                />
                { hasBadge ? this.renderBadge() : null }
            </React.Fragment>
        );
    }
}

HistoricalProfilesDropdown.propTypes = {
    entities: PropTypes.object,
    fetchHistoricalData: PropTypes.func,
    system: PropTypes.object,
    fetchCompare: PropTypes.func,
    systemIds: PropTypes.array,
    selectedHSPIds: PropTypes.array,
    selectedBaselineIds: PropTypes.array,
    selectHistoricProfiles: PropTypes.func,
    selectSystem: PropTypes.func,
    hasBadge: PropTypes.bool,
    badgeCount: PropTypes.number,
    referenceId: PropTypes.string,
    dropdownDirection: PropTypes.string,
    hasMultiSelect: PropTypes.bool,
    //selectedSystemIds: PropTypes.array,
    selectSingleHSP: PropTypes.func
};

function mapStateToProps(state) {
    return {
        //selectedSystemIds: state.entities.selectedSystemIds,
        selectedHSPIds: state.historicProfilesState.selectedHSPIds,
        selectedBaselineIds: state.baselinesTableState.checkboxTable.selectedBaselineIds
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds)),
        selectSystem: (id, selected) => dispatch({
            type: 'SELECT_ENTITY',
            payload: { id, selected }
        }),
        selectSingleHSP: (profile) => dispatch(systemsTableActions.selectSingleHSP(profile))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HistoricalProfilesDropdown));
