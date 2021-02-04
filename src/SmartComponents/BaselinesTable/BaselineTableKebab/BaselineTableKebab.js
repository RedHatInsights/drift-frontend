
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Dropdown, KebabToggle, DropdownItem } from '@patternfly/react-core';

import DeleteBaselinesModal from '../../BaselinesPage/DeleteBaselinesModal/DeleteBaselinesModal';

export class BaselineTableKebab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            modalOpened: false
        };

        this.onKebabToggle = this.onKebabToggle.bind(this);

        this.toggleModal = () => {
            const { modalOpened } = this.state;
            this.setState({
                modalOpened: !modalOpened
            });
        };
    }

    onKebabToggle(isOpen) {
        this.setState({
            isOpen
        });
    }

    fetchBaseline = () => {
        const { baselineRowData, history } = this.props;

        history.push('baselines/' + baselineRowData[0]);
    }

    render() {
        const { isOpen, modalOpened } = this.state;
        const { baselineRowData, fetchWithParams, tableId, baselineName } = this.props;
        const dropdownItems = [
            <DropdownItem
                key="edit"
                data-ouia-component-id={ 'edit-baseline-dropdown-item-' + baselineName }
                component="button"
                onClick={ this.fetchBaseline }>
                Edit
            </DropdownItem>,
            <DropdownItem
                key="delete"
                data-ouia-component-id={ 'delete-baseline-dropdown-item-' + baselineName }
                component="button"
                onClick={ this.toggleModal }>
                Delete
            </DropdownItem>
        ];

        return (
            <React.Fragment>
                { modalOpened
                    ? <DeleteBaselinesModal
                        modalOpened={ modalOpened }
                        baselineId={ baselineRowData[0] }
                        tableId={ tableId }
                        fetchWithParams={ fetchWithParams }
                        toggleModal={ this.toggleModal }
                    />
                    : null
                }
                <Dropdown
                    style={{ float: 'right' }}
                    className={ 'baseline-table-kebab' }
                    ouiaId={ 'baseline-kebab-dropdown-' + baselineName }
                    toggle={ <KebabToggle
                        data-ouia-component-id={ 'baseline-kebab-dropdown-toggle-' + baselineName }
                        data-ouia-component-type='PF4/DropdownToggle'
                        onToggle={ (isOpen) => this.onKebabToggle(isOpen) } /> }
                    isOpen={ isOpen }
                    dropdownItems={ dropdownItems }
                    isPlain
                />
            </React.Fragment>
        );
    }
}

BaselineTableKebab.propTypes = {
    baselineRowData: PropTypes.array,
    history: PropTypes.object,
    tableId: PropTypes.string,
    fetchWithParams: PropTypes.func,
    baselineName: PropTypes.string
};

export default withRouter(BaselineTableKebab);
