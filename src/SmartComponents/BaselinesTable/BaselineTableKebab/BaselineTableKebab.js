import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Dropdown, KebabToggle, DropdownItem } from '@patternfly/react-core';

import DeleteBaselinesModal from '../../BaselinesPage/DeleteBaselinesModal/DeleteBaselinesModal';

class BaselineTableKebab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            modalOpened: false
        };

        this.onKebabToggle = this.onKebabToggle.bind(this);

        this.toggleModalOpened = () => {
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
        const { baselineRowData, tableId } = this.props;
        const dropdownItems = [
            <DropdownItem
                key="edit"
                component="button"
                onClick={ this.fetchBaseline }>
                Edit
            </DropdownItem>,
            <DropdownItem
                key="delete"
                component="button"
                onClick={ this.toggleModalOpened }>
                Delete
            </DropdownItem>
        ];

        return (
            <React.Fragment>
                { modalOpened
                    ? <DeleteBaselinesModal
                        modalOpened={ true }
                        baselineId={ baselineRowData[0] }
                        tableId={ tableId }
                    />
                    : null
                }
                <Dropdown
                    style={ { float: 'right' } }
                    className={ 'baseline-table-kebab' }
                    toggle={ <KebabToggle onToggle={ (isOpen) => this.onKebabToggle(isOpen) } /> }
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
    tableId: PropTypes.string
};

export default withRouter(BaselineTableKebab);
