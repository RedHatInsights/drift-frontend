import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, KebabToggle, DropdownItem } from '@patternfly/react-core';

import DeleteFactModal from '../DeleteFactModal/DeleteFactModal';
import editBaselineHelpers from '../helpers';

class EditBaselineKebab extends Component {
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

    isDisabled = () => {
        const { editBaselineTableData } = this.props;
        let isDisabled = true;

        editBaselineTableData.forEach((fact) => {
            if (fact.selected) {
                isDisabled = false;
            }

            if (editBaselineHelpers.isCategory(fact)) {
                editBaselineHelpers.baselineSubFacts(fact).forEach((subFact) => {
                    if (subFact.selected) {
                        isDisabled = false;
                    }
                });
            }
        });

        return isDisabled;
    }

    render() {
        const { kebabOpened, modalOpened } = this.state;
        const { editBaselineTableData } = this.props;
        let dropdownItems;

        dropdownItems = [
            <DropdownItem
                key="multi-delete"
                component="button"
                onClick={ this.toggleModalOpened }
                isDisabled={ editBaselineTableData.length > 0 ? this.isDisabled() : true }
            >
                Delete facts
            </DropdownItem>
        ];

        return (
            <React.Fragment>
                { modalOpened ? <DeleteFactModal
                    toggleModal={ this.toggleModalOpened.bind(this) }
                    modalOpened={ modalOpened }
                /> : null }
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

EditBaselineKebab.propTypes = {
    editBaselineTableData: PropTypes.array
};

function mapStateToProps(state) {
    return {
        editBaselineTableData: state.editBaselineState.editBaselineTableData
    };
}

export default connect(mapStateToProps, null)(EditBaselineKebab);
