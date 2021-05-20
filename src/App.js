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
        hasHSPReadPermissions,
        hasInventoryReadPermissions,
        arePermissionsLoaded
    }, setPermissions ] = useState({
        hasCompareReadPermissions: undefined,
        hasBaselinesReadPermissions: undefined,
        hasBaselinesWritePermissions: undefined,
        hasHSPReadPermissions: undefined,
        hasInventoryReadPermissions: undefined,
        arePermissionsLoaded: false
    });

    const handlePermissionsUpdate = (hasCompareRead, hasBaselinesRead, hasBaselinesWrite, hasHSPRead, hasInventoryRead) => {
        setPermissions({
            hasCompareReadPermissions: hasCompareRead,
            hasBaselinesReadPermissions: hasBaselinesRead,
            hasBaselinesWritePermissions: hasBaselinesWrite,
            hasHSPReadPermissions: hasHSPRead,
            hasInventoryReadPermissions: hasInventoryRead,
            arePermissionsLoaded: true
        });
    };

    const hasPermission = (permission, permissionList) => {
        let hasPermission = false;

        permissionList.forEach((permissions) => {
            if (permission === permissions) {
                hasPermission = true;
            }
        });

        return hasPermission;
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
                permissionsList.some((permission) => hasPermission(permission, [ 'drift:*:*', 'drift:comparisons:read', 'drift:*:read' ])),
                permissionsList.some((permission) => hasPermission(permission, [ 'drift:*:*', 'drift:baselines:read', 'drift:*:read' ])),
                permissionsList.some((permission) => hasPermission(permission, [ 'drift:*:*', 'drift:baselines:write', 'drift:*:write' ])),
                permissionsList.some((permission) => hasPermission(
                    permission, [ 'drift:*:*', 'drift:historical-system-profiles:read', 'drift:*:read' ])
                ),
                permissionsList.some((permission) => hasPermission(permission, [ 'inventory:*:*', 'inventory:*:read' ]))
            );
        })();

        insights.chrome.on('GLOBAL_FILTER_UPDATE', ({ data }) => {
            const [ workloads, SID, tags ] = insights.chrome?.mapGlobalFilter?.(data, false, true) || [];
            dispatch(actions.setGlobalFilterTags(tags));
            dispatch(actions.setGlobalFilterWorkloads(workloads));
            dispatch(actions.setGlobalFilterSIDs(SID));
        });
    }, []);

    return (
        arePermissionsLoaded
            ? <PermissionContext.Provider
                value={{
                    permissions: {
                        compareRead: hasCompareReadPermissions,
                        baselinesRead: hasBaselinesReadPermissions,
                        baselinesWrite: hasBaselinesWritePermissions,
                        hspRead: hasHSPReadPermissions,
                        inventoryRead: hasInventoryReadPermissions
                    }
                }}>
                <NotificationsPortal />
                <Routes childProps={ props } />
            </PermissionContext.Provider>
            : null
    );
};

export default withRouter (App);
