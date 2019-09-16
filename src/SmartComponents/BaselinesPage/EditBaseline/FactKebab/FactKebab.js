import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, DropdownItem, DropdownPosition, KebabToggle } from '@patternfly/react-core';

import { factModalActions } from '../FactModal/redux';
import { baselinesTableActions } from '../../../BaselinesTable/redux';
import editBaselineHelpers from '../helpers';

class FactKebab extends Component {
    constructor(props) {
        super(props);

        this.editFact = this.editFact.bind(this);
        this.deleteFact = this.deleteFact.bind(this);
        this.addFact = this.addFact.bind(this);

        this.state = {
            isOpen: false,
            factName: this.props.factName,
            factValue: this.props.factValue,
            fact: this.props.fact
        };
    }

    onKebabToggle(isOpen) {
        this.setState({
            isOpen
        });
    }

    editFact() {
        const { factName, factValue, fact } = this.state;
        const { toggleFactModal, setFactData } = this.props;

        toggleFactModal();
        setFactData({
            factName,
            factValue,
            fact
        });
    }

    deleteFact() {
        const { factName, factValue, fact } = this.state;
        const { baselineData, patchBaseline } = this.props;
        let factToDelete = { name: factName, value: factValue };
        let newAPIBody;

        if (fact.values && factValue !== '') {
            let deletedSubFact = editBaselineHelpers.buildDeletedSubFact(factToDelete, fact);
            newAPIBody = editBaselineHelpers.makeDeleteFactPatch(deletedSubFact, baselineData, fact);
        } else {
            newAPIBody = editBaselineHelpers.makeDeleteFactPatch(factToDelete, baselineData, []);
        }

        patchBaseline(baselineData.id, newAPIBody);
    }

    addFact() {
        const { fact } = this.state;
        const { toggleFactModal, setFactData } = this.props;

        toggleFactModal();
        setFactData({ fact });
    }

    render() {
        const { isOpen, factValue, fact } = this.state;
        const dropdownItems = [
            <DropdownItem
                key="edit"
                component="button"
                onClick={ this.editFact }>
                { fact.values && factValue === '' ? 'Edit category' : 'Edit fact' }
            </DropdownItem>,
            <DropdownItem
                key="delete"
                component="button"
                onClick={ this.deleteFact }>
                { fact.values && factValue === '' ? 'Delete category' : 'Delete fact' }
            </DropdownItem>
        ];

        if (fact.values && factValue === '') {
            dropdownItems.push(
                <DropdownItem
                    key="add fact"
                    component="button"
                    onClick={ this.addFact }>
                    Add sub fact
                </DropdownItem>
            );
        }

        return (
            <Dropdown
                position={ DropdownPosition.right }
                style={ { float: 'right' } }
                className={ 'baseline-fact-kebab' }
                toggle={ <KebabToggle onToggle={ (isOpen) => this.onKebabToggle(isOpen) } /> }
                isOpen={ isOpen }
                dropdownItems={ dropdownItems }
                isPlain
            />
        );
    }
}

FactKebab.propTypes = {
    factName: PropTypes.string,
    factValue: PropTypes.string,
    fact: PropTypes.object,
    toggleFactModal: PropTypes.func,
    setFactData: PropTypes.func,
    baselineData: PropTypes.obj,
    patchBaseline: PropTypes.func
};

function mapStateToProps(state) {
    return {
        baselineData: state.baselinesTableState.baselineData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleFactModal: () => dispatch(factModalActions.toggleFactModal()),
        setFactData: (factData) => dispatch(factModalActions.setFactData(factData)),
        patchBaseline: (baselineId, newAPIBody) => dispatch(baselinesTableActions.patchBaseline(baselineId, newAPIBody))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FactKebab);
