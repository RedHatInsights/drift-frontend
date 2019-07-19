import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody,
    TextInput,
    Title } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

import { baselinesPageActions } from '../redux';

class CreateBaseline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            baselineName: ''
        };

        this.changeBaselineName = value => {
            this.setState({ value });
        };
    }

    submitBaselineName() {
    }

    render() {
        const { baselineName } = this.state;

        return (
            <EmptyState variant={ EmptyStateVariant.full }>
                <EmptyStateIcon icon={ CubesIcon } />
                <Title headingLevel="h5" size="lg">
                    Create Baseline
                </Title>
                <EmptyStateBody>
                    Create a baseline name
                    <TextInput value={ baselineName } type="text" onChange={ this.changeBaselineName } aria-label="baseline name" />
                    <Button onClick={ this.submitBaselineName }>Submit</Button>
                </EmptyStateBody>
            </EmptyState>
        );
    }
}

CreateBaseline.propTypes = {
    toggleCreateBaseline: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateBaseline: (() => dispatch(baselinesPageActions.toggleCreateBaseline()))
    };
}

export default connect(null, mapDispatchToProps)(CreateBaseline);
