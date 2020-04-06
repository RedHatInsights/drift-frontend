import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, DropdownItem, DropdownPosition, KebabToggle } from '@patternfly/react-core';

import { editBaselineActions } from '../redux';
import editBaselineHelpers from '../helpers';
import DeleteFactModal from '../DeleteFactModal/DeleteFactModal';

class FactKebab extends Component {
    constructor(props) {
        super(props);

        this.editFact = this.editFact.bind(this);
        this.deleteFact = this.deleteFact.bind(this);
        this.addFact = this.addFact.bind(this);

        this.state = {
            isOpen: false,
            modalOpened: false
        };

        this.toggleModalOpened = () => {
            const { modalOpened } = this.state;

            this.setState({
                modalOpened: !modalOpened,
                isOpen: false
            });
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

    async deleteFact() {
        const { baselineData, patchBaseline, factName, factValue, fact, isSubFact, fetchBaselineData } = this.props;
        let factToDelete = { name: factName, value: factValue };
        let newAPIBody;

        if (isSubFact === true) {
            newAPIBody = editBaselineHelpers.makeDeleteSubFactPatch(factToDelete, fact, baselineData);
        } else {
            newAPIBody = editBaselineHelpers.makeDeleteFactPatch(factToDelete, baselineData, []);
        }

        this.toggleModalOpened();
        let results = await patchBaseline(baselineData.id, newAPIBody);
        if (results) {
            fetchBaselineData(baselineData.id);
        }

        this.onKebabToggle(false);
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
        const { isOpen, modalOpened } = this.state;
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
                onClick={ this.toggleModalOpened }>
                { isCategory ? 'Delete category' : 'Delete fact' }
            </DropdownItem>
        );

        return (
            <React.Fragment>
                { modalOpened ? <DeleteFactModal
                    toggleModal={ this.toggleModalOpened.bind(this) }
                    deleteFact={ this.deleteFact.bind(this) }
                    isCategory={ isCategory }
                    modalOpened={ modalOpened }
                    categoryMessage={ isCategory ? '1 category' : null }
                    factMessage={ isCategory ? null : '1 fact' }
                /> : null }
                <Dropdown
                    position={ DropdownPosition.right }
                    style={ { float: 'right' } }
                    className={ 'baseline-fact-kebab' }
                    toggle={ <KebabToggle onToggle={ (isOpen) => this.onKebabToggle(isOpen) } /> }
                    isOpen={ isOpen }
                    dropdownItems={ dropdownItems }
                    isPlain
                />
            </React.Fragment>
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
    patchBaseline: PropTypes.func,
    fetchBaselineData: PropTypes.func
};

function mapStateToProps(state) {
    return {
        baselineData: state.editBaselineState.baselineData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleFactModal: () => dispatch(editBaselineActions.toggleFactModal()),
        setFactData: (factData) => dispatch(editBaselineActions.setFactData(factData)),
        patchBaseline: (baselineId, newAPIBody) => dispatch(editBaselineActions.patchBaseline(baselineId, newAPIBody)),
        fetchBaselineData: (baselineUUID) => dispatch(editBaselineActions.fetchBaselineData(baselineUUID))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FactKebab);
