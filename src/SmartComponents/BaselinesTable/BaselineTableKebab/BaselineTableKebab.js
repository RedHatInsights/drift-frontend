import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown, KebabToggle, DropdownItem } from '@patternfly/react-core';

import { baselinesTableActions } from '../redux';

class BaselineTableKebab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };

        this.deleteBaselineData = this.deleteBaselineData.bind(this);
        this.onKebabToggle = this.onKebabToggle.bind(this);
    }

    deleteBaselineData() {
        const { setIdDelete, deleteBaseline, baselineRowData } = this.props;

        setIdDelete(baselineRowData[0]);
        deleteBaseline(baselineRowData[0]);
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
        const { isOpen } = this.state;
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
                onClick={ this.deleteBaselineData }>
                Delete
            </DropdownItem>
        ];

        return (
            <Dropdown
                style={ { float: 'right' } }
                className={ 'baseline-table-kebab' }
                toggle={ <KebabToggle onToggle={ (isOpen) => this.onKebabToggle(isOpen) } /> }
                isOpen={ isOpen }
                dropdownItems={ dropdownItems }
                isPlain
            />
        );
    }
}

BaselineTableKebab.propTypes = {
    setIdDelete: PropTypes.func,
    deleteBaseline: PropTypes.func,
    baselineRowData: PropTypes.array,
    history: PropTypes.obj
};

function mapDispatchToProps(dispatch) {
    return {
        setIdDelete: (baselineUUID) => dispatch(baselinesTableActions.setIdDelete(baselineUUID)),
        deleteBaseline: (baselineUUID) => dispatch(baselinesTableActions.deleteBaseline(baselineUUID))
    };
}

export default withRouter(connect(null, mapDispatchToProps)(BaselineTableKebab));
