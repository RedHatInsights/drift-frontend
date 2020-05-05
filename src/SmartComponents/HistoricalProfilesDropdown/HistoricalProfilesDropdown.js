import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Badge, Dropdown, DropdownItem, DropdownToggle, DropdownPosition } from '@patternfly/react-core';
import { HistoryIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

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

    componentDidUpdate(prevProps) {
        if (prevProps.selectedHSPIds.length > 0 && this.props.selectedHSPIds.length === 0) {
            this.setState({ badgeCount: 0 });
        }
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
        const { hasCompareButton } = this.props;

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

            if (hasCompareButton) {
                dropdownItems.push(
                    <div className="sticky-compare">
                        <FetchHistoricalProfilesButton fetchCompare={ this.fetchCompare } />
                    </div>
                );
            }
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
                    className="historical-system-profile-dropdown"
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
    fetchHistoricalData: PropTypes.func,
    system: PropTypes.object,
    fetchCompare: PropTypes.func,
    systemIds: PropTypes.array,
    selectedHSPIds: PropTypes.array,
    selectedBaselineIds: PropTypes.array,
    selectHistoricProfiles: PropTypes.func,
    hasBadge: PropTypes.bool,
    hasCompareButton: PropTypes.bool,
    badgeCount: PropTypes.number,
    referenceId: PropTypes.string,
    dropdownDirection: PropTypes.object
};

function mapStateToProps(state) {
    return {
        selectedHSPIds: state.historicProfilesState.selectedHSPIds,
        selectedBaselineIds: state.baselinesTableState.checkboxTable.selectedBaselineIds
    };
}

function mapDispatchToProps(dispatch) {
    return {
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HistoricalProfilesDropdown));
