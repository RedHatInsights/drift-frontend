import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';

import { factModalActions } from '../FactModal/redux';

class EditBaselineToolbar extends Component {
    constructor(props) {
        super(props);

        this.handleAddFact = this.handleAddFact.bind(this);
    }

    handleAddFact() {
        const { setFactData, toggleFactModal } = this.props;

        setFactData({ factName: '', factValue: '', fact: []});
        toggleFactModal();
    }

    render() {
        return (
            <Toolbar className='display-margin'>
                <ToolbarGroup>
                    <ToolbarItem>
                        <Button
                            variant='primary'
                            onClick={ this.handleAddFact }>
                            Add fact
                        </Button>
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>
        );
    };
}

EditBaselineToolbar.propTypes = {
    toggleFactModal: PropTypes.func,
    setFactData: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        toggleFactModal: () => dispatch(factModalActions.toggleFactModal()),
        setFactData: (factData) => dispatch(factModalActions.setFactData(factData))
    };
}

export default connect(null, mapDispatchToProps)(EditBaselineToolbar);
