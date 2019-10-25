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
            isOpen: false
        };
    }

    onKebabToggle(isOpen) {
        this.setState({
            isOpen
        });
    }

    editFact() {
        const { toggleFactModal, setFactData, factName, factValue, fact, isCategory, isSubFact } = this.props;

        toggleFactModal();
        setFactData({
            factName,
            factValue,
            fact,
            isCategory,
            isSubFact
        });
    }

    deleteFact() {
        const { baselineData, patchBaseline, factName, factValue, fact } = this.props;
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
        const { toggleFactModal, setFactData, fact, isCategory } = this.props;

        toggleFactModal();
        setFactData({
            factName: '',
            factValue: '',
            fact,
            isSubFact: isCategory
        });
    }

    render() {
        const { isOpen } = this.state;
        const { isCategory } = this.props;
        const dropdownItems = [];

        if (isCategory === true) {
            dropdownItems.push(
                <DropdownItem
                    key="add fact"
                    component="button"
                    onClick={ this.addFact }>
                    Add sub fact
                </DropdownItem>
            );
        }

        dropdownItems.push(
            <DropdownItem
                key="edit"
                component="button"
                onClick={ this.editFact }>
                { isCategory ? 'Edit category' : 'Edit fact' }
            </DropdownItem>,
            <DropdownItem
                key="delete"
                component="button"
                onClick={ this.deleteFact }>
                { isCategory ? 'Delete category' : 'Delete fact' }
            </DropdownItem>
        );

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
    isCategory: PropTypes.bool,
    isSubFact: PropTypes.bool,
    toggleFactModal: PropTypes.func,
    setFactData: PropTypes.func,
    baselineData: PropTypes.object,
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
