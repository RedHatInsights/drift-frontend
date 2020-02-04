import React, { Component } from 'react';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { UndoIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components';

import HistoricalProfilesCheckbox from './HistoricalProfilesCheckbox/HistoricalProfilesCheckbox';
import api from '../../api';
import FetchHistoricalProfilesButton from './FetchHistoricalProfilesButton/FetchHistoricalProfilesButton';

class HistoricalProfilesDropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            historicalData: this.renderLoadingRows()
        };

        this.onToggle = () => {
            const { isOpen } = this.state;

            if (isOpen === false) {
                this.fetchData(this.props.systemId);
            }

            this.setState({
                isOpen: !isOpen
            });
        };
    }

    async fetchData(systemId) {
        let historicalData = await api.fetchHistoricalData(systemId);

        this.setState({
            historicalData: this.createDropdownArray(historicalData)
        });
    }

    createDropdownArray = (historicalData) => {
        const { fetchCompare } = this.props;

        let dropdownItems = [];

        historicalData.profiles.forEach(function(profile) {
            dropdownItems.push(
                <DropdownItem>
                    <HistoricalProfilesCheckbox profile={ profile } />
                </DropdownItem>
            );
        });

        dropdownItems.push(<FetchHistoricalProfilesButton fetchCompare={ fetchCompare }/>);

        return dropdownItems;
    }

    renderLoadingRows() {
        let rows = [];

        for (let i = 0; i < 3; i += 1) {
            rows.push(
                <Skeleton className='pit-dropdown-loading pit-button' size={ SkeletonSize.sm } />
            );
            rows.push(<br></br>);
        }

        return rows;
    }

    render() {
        const { isOpen, historicalData } = this.state;

        return (
            <React.Fragment>
                <Dropdown
                    toggle={ <DropdownToggle
                        className='historical-system-profile-dropdown'
                        iconComponent={ null }
                        onToggle={ this.onToggle }>
                        <UndoIcon />
                    </DropdownToggle> }
                    isOpen={ isOpen }
                    isPlain
                    dropdownItems={ historicalData }
                />
            </React.Fragment>
        );
    }
}

HistoricalProfilesDropdown.propTypes = {
    fetchHistoricalData: PropTypes.func,
    systemId: PropTypes.string,
    fetchCompare: PropTypes.func
};

export default HistoricalProfilesDropdown;
