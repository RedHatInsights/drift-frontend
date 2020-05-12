import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { compareActions } from '../../modules';
import { actionKebabActions } from './redux';
import { Dropdown, KebabToggle, DropdownItem } from '@patternfly/react-core';
import { setHistory } from '../../../Utilities/SetHistory';

import { baselinesTableActions } from '../../BaselinesTable/redux';
import { historicProfilesActions } from '../../HistoricalProfilesDropdown/redux';

class ActionKebab extends Component {
    constructor(props) {
        super(props);

        this.removeSystemsSelect = this.removeSystemsSelect.bind(this);
    }

    removeSystemsSelect() {
        const { history, toggleKebab, removeSystems, clearSelectedBaselines, selectHistoricProfiles, selectedHSPIds, updateReferenceId } = this.props;

        toggleKebab();
        removeSystems();
        clearSelectedBaselines('CHECKBOX');
        selectHistoricProfiles(selectedHSPIds);
        updateReferenceId();
        setHistory(history, []);
    }

    render() {
        const dropdownItems = [
            <DropdownItem key="remove-systems" component="button" onClick={ this.removeSystemsSelect }>Clear all comparisons</DropdownItem>
        ];
        return (
            <Dropdown
                id='action-kebab'
                aria-label='action-kebab'
                style={ { float: 'left' } }
                toggle={ <KebabToggle onToggle={ this.props.toggleKebab } /> }
                isOpen={ this.props.kebabOpened }
                dropdownItems={ dropdownItems }
                isPlain
            />
        );
    }
}

ActionKebab.propTypes = {
    removeSystems: PropTypes.func,
    clearSelectedBaselines: PropTypes.func,
    toggleKebab: PropTypes.func,
    kebabOpened: PropTypes.bool,
    history: PropTypes.object,
    selectedHSPIds: PropTypes.array,
    selectHistoricProfiles: PropTypes.func,
    updateReferenceId: PropTypes.func
};

function mapStateToProps(state) {
    return {
        kebabOpened: state.kebabOpened,
        selectedHSPIds: state.historicProfilesState.selectedHSPIds
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeSystems: () => dispatch(compareActions.clearState()),
        clearSelectedBaselines: (tableId) => dispatch(baselinesTableActions.clearSelectedBaselines(tableId)),
        toggleKebab: () => dispatch(actionKebabActions.toggleKebab()),
        selectHistoricProfiles: (historicProfileIds) => dispatch(historicProfilesActions.selectHistoricProfiles(historicProfileIds))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActionKebab));
