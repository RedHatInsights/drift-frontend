import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Dropdown, KebabToggle, DropdownItem } from '@patternfly/react-core';
import DeleteBaselinesModal from '../DeleteBaselinesModal/DeleteBaselinesModal';

export class BaselinesKebab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            kebabOpened: false,
            modalOpened: false
        };

        this.toggleKebab = () => {
            const { kebabOpened } = this.state;
            this.setState({
                kebabOpened: !kebabOpened
            });
        };

        this.toggleModalOpened = () => {
            const { modalOpened } = this.state;
            this.setState({
                modalOpened: !modalOpened,
                kebabOpened: false
            });
        };

        this.clearFilters = () => {
            const { clearFilters } = this.props;
            this.setState({
                kebabOpened: false
            });
            clearFilters();
        };
    }

    render() {
        const { kebabOpened, modalOpened } = this.state;
        const { clearFilters, fetchWithParams, selectedBaselineIds, tableId } = this.props;
        let dropdownItems;

        dropdownItems = [
            <DropdownItem
                key="multi-delete"
                component="button"
                onClick={ this.toggleModalOpened }
                isDisabled={ selectedBaselineIds.length < 1 }
            >
                Delete baselines
            </DropdownItem>,
            <DropdownItem
                key="clear-filters"
                component="button"
                onClick={ clearFilters ? this.clearFilters : null }
                isDisabled={ clearFilters ? false : true }
            >
                Clear filters
            </DropdownItem>
        ];

        return (
            <React.Fragment>
                { modalOpened
                    ? <DeleteBaselinesModal
                        modalOpened={ true }
                        tableId={ tableId }
                        fetchWithParams={ fetchWithParams }
                    />
                    : null
                }
                <Dropdown
                    style={ { float: 'left' } }
                    toggle={ <KebabToggle onToggle={ this.toggleKebab } /> }
                    isOpen={ kebabOpened }
                    dropdownItems={ dropdownItems }
                    isPlain
                />
            </React.Fragment>
        );
    }
}

BaselinesKebab.propTypes = {
    fetchWithParams: PropTypes.func,
    selectedBaselineIds: PropTypes.array,
    tableId: PropTypes.string,
    clearFilters: PropTypes.func
};

function mapStateToProps(state) {
    return {
        selectedBaselineIds: state.baselinesTableState.checkboxTable.selectedBaselineIds
    };
}

export default connect(mapStateToProps, null)(BaselinesKebab);
