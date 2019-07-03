import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { Button } from '@patternfly/react-core';
import { Main, Section, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { withCookies, Cookies } from 'react-cookie';
import { EXPERIMENTAL_COOKIE_NAME } from '../../constants';

class ExperimentalCookie extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.enableCookie = this.enableCookie.bind(this);
        this.disableCookie = this.disableCookie.bind(this);
        this.getMessage = this.getMessage.bind(this);
    }

    enableCookie() {
        const now = new Date();
        const { cookies } = this.props;
        now.setHours(now.getHours() + 24);

        cookies.set(EXPERIMENTAL_COOKIE_NAME, 'enabled', { path: '/', expires: now });
    }

    disableCookie() {
        const now = new Date();
        const { cookies } = this.props;
        now.setMonth(now.getMonth() - 1);

        cookies.set(EXPERIMENTAL_COOKIE_NAME, '', { path: '/', expires: now });
    }

    getMessage() {
        const { cookies } = this.props;
        let message = 'Experimental features are ' + cookies.get(EXPERIMENTAL_COOKIE_NAME);

        return message;
    }

    render() {
        const { cookies } = this.props;
        let message = '';

        if (cookies.get(EXPERIMENTAL_COOKIE_NAME)) {
            message = this.getMessage();
        }

        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title="Enable/Disable Experimental Features"/>
                </PageHeader>
                <Main>
                    <Section type="button-group">
                        <Button
                            key="enable"
                            variant="primary"
                            onClick={ this.enableCookie }>
                            Enable experimental features
                        </Button>
                        <Button
                            key="disable"
                            variant="primary"
                            onClick={ this.disableCookie }>
                            Disable experimental features
                        </Button>
                    </Section>
                    { message }
                </Main>
            </React.Fragment>
        );
    }
}

export default withCookies(ExperimentalCookie);
