import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';

export class EmptyStateDisplay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { icon, text, title, button, error, color } = this.props;

        return (
            <Bullseye>
                <EmptyState variant={ EmptyStateVariant.large }>
                    { icon ? <EmptyStateIcon icon={ icon } color={ color ? color : null } /> : null }
                    <br></br>
                    <Title headingLevel='h1' size="lg">{ title }</Title>
                    <EmptyStateBody>
                        { text ? text.join('\n') : null }
                        { error
                            ? <div>
                                <br></br>
                                <p id='empty-state-error'><small>
                                    { error }
                                </small></p>
                                <br></br>
                            </div>
                            : null
                        }
                    </EmptyStateBody>
                    { button }
                </EmptyState>
            </Bullseye>
        );
    }
}

EmptyStateDisplay.propTypes = {
    icon: PropTypes.any,
    text: PropTypes.array,
    title: PropTypes.string,
    button: PropTypes.object,
    error: PropTypes.string,
    color: PropTypes.string
};

export default EmptyStateDisplay;
