import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Badge, Dropdown, DropdownItem, DropdownToggle, DropdownPosition } from '@patternfly/react-core';
import { HistoryIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';
import { setHistory } from '../../Utilities/SetHistory';

import { compareActions } from '../modules';
import { historicProfilesActions } from '../HistoricalProfilesDropdown/redux';
import HistoricalProfilesCheckbox from './HistoricalProfilesCheckbox/HistoricalProfilesCheckbox';
import api from '../../api';
import FetchHistoricalProfilesButton from './FetchHistoricalProfilesButton/FetchHistoricalProfilesButton';

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
    }

    fetchCompare = () => {
        const { systemIds, selectedBaselineIds, selectedHSPIds, fetchCompare, history } = this.props;

        setHistory(history, systemIds, selectedBaselineIds, selectedHSPIds);
        fetchCompare(systemIds, selectedBaselineIds, selectedHSPIds);
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
        const { hasBadge } = this.props;

        let dropdownItems = [];
        let badgeCountFunc = this.updateBadgeCount;

        if (historicalData.profiles.length > 0) {
            historicalData.profiles.forEach(function(profile) {
                dropdownItems.push(
                    <DropdownItem>
                        <HistoricalProfilesCheckbox
                            profile={ profile }
                            updateBadgeCount={ badgeCountFunc }
                        />
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
                <Skeleton className='hsp-dropdown-loading hsp-button' size={ SkeletonSize.sm } />
            );
            rows.push(<br></br>);
        }

        return rows;
    }

    updateBadgeCount = (checked) => {
        let newBadgeCount = this.state.badgeCount;
        newBadgeCount += checked ? 1 : -1;

        this.setState({ badgeCount: newBadgeCount });
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
                    toggle={ <DropdownToggle
                        className='historical-system-profile-dropdown hsp-dropdown-icon'
                        iconComponent={ null }
                        onToggle={ this.onToggle }>
                        <HistoryIcon />
                    </DropdownToggle> }
                    isOpen={ isOpen }
                    isPlain
                    position={ DropdownPosition.right }
                    dropdownItems={ dropDownArray }
                />
                { hasBadge ? this.renderBadge() : null }
            </React.Fragment>
        );
    }
}

HistoricalProfilesDropdown.propTypes = {
    fetchHistoricalData: PropTypes.func,
    system: PropTypes.object,
    fetchCompare: PropTypes.func,
    history: PropTypes.object,
    systemIds: PropTypes.array,
    selectedHSPIds: PropTypes.array,
    selectedBaselineIds: PropTypes.array,
    selectHistoricProfiles: PropTypes.func,
    hasBadge: PropTypes.bool,
    badgeCount: PropTypes.number
};

function mapStateToProps(state) {
    return {
        selectedHSPIds: state.historicProfilesState.selectedHSPIds,
        selectedBaselineIds: state.baselinesTableState.checkboxTable.selectedBaselineIds
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchCompare: ((systemIds, selectedBaselineIds, selectedHSPIds) =>
            dispatch(compareActions.fetchCompare(systemIds, selectedBaselineIds, selectedHSPIds))
        ),
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HistoricalProfilesDropdown));
