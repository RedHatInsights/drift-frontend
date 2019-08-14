import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody,
    InputGroup,
    TextInput,
    Title } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

import { baselinesPageActions } from '../redux';
import { baselinesTableActions } from '../../BaselinesTable/redux';

class CreateBaseline extends Component {
    constructor(props) {
        super(props);
        this.submitBaselineName = this.submitBaselineName.bind(this);

        this.state = {
            baselineName: ''
        };

        this.updateBaselineName = value => {
            this.setState({ baselineName: value });
        };
    }

    submitBaselineName() {
        const { baselineName } = this.state;
        const { createBaseline, toggleCreateBaseline } = this.props;
        /*eslint-disable camelcase*/
        let newBaselineObject = { display_name: baselineName, baseline_facts: []};
        /*eslint-enable camelcase*/

        createBaseline(newBaselineObject);
        toggleCreateBaseline();
    }

    render() {
        const { baselineName } = this.state;

        return (
            <React.Fragment>
                <EmptyState variant={ EmptyStateVariant.full }>
                    <EmptyStateIcon icon={ CubesIcon } />
                    <Title headingLevel="h5" size="lg">
                        Create Baseline
                    </Title>
                    <EmptyStateBody>
                        Create a baseline name
                        <InputGroup>
                            <TextInput value={ baselineName } type="text" onChange={ this.updateBaselineName } aria-label="baseline name" />
                            <Button onClick={ this.submitBaselineName }>Submit</Button>
                        </InputGroup>
                    </EmptyStateBody>
                </EmptyState>
            </React.Fragment>
        );
    }
}

CreateBaseline.propTypes = {
    toggleCreateBaseline: PropTypes.func,
    createBaseline: PropTypes.func
};

function mapDispatchToProps(dispatch) {
    return {
        toggleCreateBaseline: () => dispatch(baselinesPageActions.toggleCreateBaseline()),
        createBaseline: (newBaselineObject) => dispatch(baselinesTableActions.createBaseline(newBaselineObject))
    };
}

export default connect(null, mapDispatchToProps)(CreateBaseline);
