import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';

export class EmptyStateDisplay extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await window.insights?.chrome?.appAction?.('comparison-list');
    }

    render() {
        const { button, color, error, icon, isSmall, text, title } = this.props;

        /*eslint-disable react/jsx-key*/
        return (
            <EmptyState variant={ isSmall ? EmptyStateVariant.small : EmptyStateVariant.large }>
                { icon
                    ? <EmptyStateIcon
                        icon={ icon }
                        color={ color ? color : null }
                        className={ isSmall ? 'small-empty-state-icon' : null }
                    />
                    : null
                }
                <br></br>
                <Title
                    headingLevel={ isSmall ? 'h5' : 'h1' }
                    size={ isSmall ? 'md' : 'lg' }
                >
                    { title }
                </Title>
                <EmptyStateBody>
                    { text ? text.map(line =>
                        <React.Fragment>
                            { line }
                            <br />
                        </React.Fragment>)
                        : null
                    }
                    { error ? error : null }
                </EmptyStateBody>
                { button }
            </EmptyState>
        );
        /*eslint-enable react/jsx-key*/
    }
}

EmptyStateDisplay.propTypes = {
    button: PropTypes.object,
    color: PropTypes.string,
    error: PropTypes.string,
    icon: PropTypes.any,
    isSmall: PropTypes.bool,
    text: PropTypes.array,
    title: PropTypes.string
};

export default EmptyStateDisplay;
