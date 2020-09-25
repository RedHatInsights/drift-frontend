import PropTypes from 'prop-types';
import React, { createContext, Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';

import { Routes } from './Routes';
import './App.scss';

export const PermissionContext = createContext();

class App extends Component {

    constructor() {
        super();
        this.state = {
            hasCompareReadPermissions: undefined,
            hasBaselinesReadPermissions: undefined,
            hasBaselinesWritePermissions: undefined,
            arePermissionsLoaded: false
        };
    }

    handlePermissionsUpdate = (hasCompareRead, hasBaselinesRead, hasBaselinesWrite) => this.setState({
        hasCompareReadPermissions: hasCompareRead,
        hasBaselinesReadPermissions: hasBaselinesRead,
        hasBaselinesWritePermissions: hasBaselinesWrite,
        arePermissionsLoaded: true
    });

    componentDidMount () {
        insights.chrome.init();
        insights.chrome.identifyApp('drift');
        insights.chrome.on('APP_NAVIGATION', event => {
            if (event.domEvent !== undefined && event.domEvent.type === 'click') {
                this.props.history.push(`/${event.navId}`);
            }
        });
        window.insights.chrome.getUserPermissions('drift').then(
            driftPermissions => {
                const permissionsList = driftPermissions.map(permissions => permissions.permission);
                if (permissionsList.includes('drift:*:*')) {
                    this.handlePermissionsUpdate(true, true, true);
                } else {
                    this.handlePermissionsUpdate(
                        permissionsList.includes('drift:comparison:read' || 'drift:*:read'),
                        permissionsList.includes('drift:baselines:read' || 'drift:*:read'),
                        permissionsList.includes('drift:baselines:write' || 'drift:*:write')
                    );
                }
            }
        );
    }

    componentWillUnmount () {
        this.appNav();
        this.buildNav();
    }

    render () {
        const { hasCompareReadPermissions, hasBaselinesReadPermissions, hasBaselinesWritePermissions, arePermissionsLoaded } = this.state;

        return (
            arePermissionsLoaded
                ? <PermissionContext.Provider
                    value={ {
                        permissions: {
                            compareRead: hasCompareReadPermissions,
                            baselinesRead: hasBaselinesReadPermissions,
                            baselinesWrite: hasBaselinesWritePermissions
                        }
                    } }>
                    <NotificationsPortal />
                    <Routes childProps={ this.props } />
                </PermissionContext.Provider>
                : null
        );
    }
}

App.propTypes = {
    history: PropTypes.object
};

export default withRouter (connect()(App));
