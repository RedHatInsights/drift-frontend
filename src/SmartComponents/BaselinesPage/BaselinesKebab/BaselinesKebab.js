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
    }

    render() {
        const { kebabOpened, modalOpened } = this.state;
        const { selectedBaselineIds } = this.props;
        let dropdownItems;

        dropdownItems = [
            <DropdownItem
                key="multi-delete"
                component="button"
                onClick={ this.toggleModalOpened }
                isDisabled={ selectedBaselineIds.length < 1 }
            >
                Delete baselines
            </DropdownItem>
        ];

        return (
            <React.Fragment>
                { modalOpened ? <DeleteBaselinesModal modalOpened={ true } /> : null }
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
    selectedBaselineIds: PropTypes.array
};

function mapStateToProps(state) {
    return {
        selectedBaselineIds: state.baselinesTableState.selectedBaselineIds
    };
}

export default connect(mapStateToProps, null)(BaselinesKebab);
