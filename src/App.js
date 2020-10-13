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
        hasInventoryReadPermissions,
        arePermissionsLoaded
    }, setPermissions ] = useState({
        hasCompareReadPermissions: undefined,
        hasBaselinesReadPermissions: undefined,
        hasBaselinesWritePermissions: undefined,
        hasInventoryReadPermissions: undefined,
        arePermissionsLoaded: false
    });

    const handlePermissionsUpdate = (hasCompareRead, hasBaselinesRead, hasBaselinesWrite, hasInventoryRead) => {
        setPermissions({
            hasCompareReadPermissions: hasCompareRead,
            hasBaselinesReadPermissions: hasBaselinesRead,
            hasBaselinesWritePermissions: hasBaselinesWrite,
            hasInventoryReadPermissions: hasInventoryRead,
            arePermissionsLoaded: true
        });
    };

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
            const fullPermissions = driftPermissions.concat(await window.insights.chrome.getUserPermissions('inventory'));
            const permissionsList = fullPermissions.map(permissions => permissions.permission);
            handlePermissionsUpdate(
                permissionsList.includes('drift:*:*' || 'drift:comparisons:read' || 'drift:*:read'),
                permissionsList.includes('drift:*:*' || 'drift:baselines:read' || 'drift:*:read'),
                permissionsList.includes('drift:*:*' || 'drift:baselines:write' || 'drift:*:write'),
                permissionsList.includes('inventory:*:*', 'inventory:*:read')
            );
        })();

        insights.chrome.on('GLOBAL_FILTER_UPDATE', ({ data }) => {
            const tags = insights.chrome?.mapGlobalFilter?.(data).filter(item => !item.includes('workloads')) || undefined;
            dispatch(actions.setGlobalFilterTags(tags));
        });
    }, []);

    return (
        arePermissionsLoaded
            ? <PermissionContext.Provider
                value={ {
                    permissions: {
                        compareRead: hasCompareReadPermissions,
                        baselinesRead: hasBaselinesReadPermissions,
                        baselinesWrite: hasBaselinesWritePermissions,
                        inventoryRead: hasInventoryReadPermissions
                    }
                } }>
                <NotificationsPortal />
                <Routes childProps={ props } />
            </PermissionContext.Provider>
            : null
    );
};

export default withRouter (App);
