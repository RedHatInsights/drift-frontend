import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';

export class EmptyStateDisplay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { icon, text, title, button, error, color } = this.props;

        return (
            <Bullseye>
                <EmptyState>
                    { icon ? <EmptyStateIcon icon={ icon } color={ color ? color : null } /> : null }
                    <br></br>
                    <Title size="lg">{ title }</Title>
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
    icon: PropTypes.func,
    text: PropTypes.array,
    title: PropTypes.string,
    button: PropTypes.object,
    error: PropTypes.string,
    color: PropTypes.string
};

export default EmptyStateDisplay;
