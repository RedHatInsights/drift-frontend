import React, { createContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from './SmartComponents/modules/actions';
import { withRouter, useHistory } from 'react-router-dom';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';

import { Routes } from './Routes';
import './App.scss';

export const PermissionContext = createContext();

const App = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [{
        hasCompareReadPermissions,
        hasBaselinesReadPermissions,
        hasBaselinesWritePermissions,
        arePermissionsLoaded
    }, setPermissions ] = useState({
        hasCompareReadPermissions: undefined,
        hasBaselinesReadPermissions: undefined,
        hasBaselinesWritePermissions: undefined,
        arePermissionsLoaded: false
    });

    const handlePermissionsUpdate = (hasCompareRead, hasBaselinesRead, hasBaselinesWrite) => setPermissions({
        hasCompareReadPermissions: hasCompareRead,
        hasBaselinesReadPermissions: hasBaselinesRead,
        hasBaselinesWritePermissions: hasBaselinesWrite,
        arePermissionsLoaded: true
    });

    useEffect(() => {
        insights.chrome.init();
        insights.chrome.identifyApp('drift');
        insights.chrome.on('APP_NAVIGATION', event => {
            if (event.domEvent !== undefined && event.domEvent.type === 'click') {
                history.push(`/${event.navId}`);
            }
        });
        (async () => {
            const driftPermissions = await window.insights.chrome.getUserPermissions('drift');
            const permissionsList = driftPermissions.map(permissions => permissions.permission);
            if (permissionsList.includes('drift:*:*')) {
                handlePermissionsUpdate(true, true, true);
            } else {
                handlePermissionsUpdate(
                    permissionsList.includes('drift:comparisons:read' || 'drift:*:read'),
                    permissionsList.includes('drift:baselines:read' || 'drift:*:read'),
                    permissionsList.includes('drift:baselines:write' || 'drift:*:write')
                );
            }
        })();

        insights.chrome.on('GLOBAL_FILTER_UPDATE', ({ data }) => {
            const tags = insights.chrome?.mapGlobalFilter?.(data).filter(item => !item.includes('workloads')) || undefined;
            dispatch(actions.setGlobalGilterTags(tags));
        });
    }, []);

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
                <Routes childProps={ props } />
            </PermissionContext.Provider>
            : null
    );
};

export default withRouter (App);
