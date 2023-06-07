import React, { createContext, useState, useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';
import actions from './SmartComponents/modules/actions';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

import Router from './Routes';
import './App.scss';
import { useNavigate } from 'react-router-dom';

export const PermissionContext = createContext();

const App = () => {
    const dispatch = useDispatch();
    const store = useStore();
    const chrome = useChrome();
    const navigate = useNavigate();

    const [{
        hasCompareReadPermissions,
        hasBaselinesReadPermissions,
        hasBaselinesWritePermissions,
        hasHSPReadPermissions,
        hasInventoryReadPermissions,
        hasNotificationsWritePermissions,
        hasNotificationsReadPermissions,
        arePermissionsLoaded
    }, setPermissions ] = useState({
        hasCompareReadPermissions: undefined,
        hasBaselinesReadPermissions: undefined,
        hasBaselinesWritePermissions: undefined,
        hasHSPReadPermissions: undefined,
        hasInventoryReadPermissions: undefined,
        hasNotificationsWritePermissions: undefined,
        hasNotificationsReadPermissions: undefined,
        arePermissionsLoaded: false
    });

    const handlePermissionsUpdate = (hasCompareRead, hasBaselinesRead, hasBaselinesWrite, hasHSPRead,
        hasInventoryRead, hasNotificationsWrite, hasNotificationsRead) => {
        setPermissions({
            hasCompareReadPermissions: hasCompareRead,
            hasBaselinesReadPermissions: hasBaselinesRead,
            hasBaselinesWritePermissions: hasBaselinesWrite,
            hasHSPReadPermissions: hasHSPRead,
            hasInventoryReadPermissions: hasInventoryRead,
            hasNotificationsWritePermissions: hasNotificationsWrite,
            hasNotificationsReadPermissions: hasNotificationsRead,
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
        chrome.identifyApp('drift');
        chrome.on('APP_NAVIGATION', event => {
            if (event.domEvent !== undefined && event.domEvent.type === 'click') {
                navigate(`/${event.navId}`);
            }
        });
        (async () => {
            const driftPermissions = await chrome.getUserPermissions('drift');
            const fullPermissions = driftPermissions.concat(await chrome.getUserPermissions('inventory'));
            const permissionsList = fullPermissions.map(permissions => permissions.permission);
            handlePermissionsUpdate(
                permissionsList.some((permission) => hasPermission(permission, [ 'drift:*:*', 'drift:comparisons:read', 'drift:*:read' ])),
                permissionsList.some((permission) => hasPermission(permission, [ 'drift:*:*', 'drift:baselines:read', 'drift:*:read' ])),
                permissionsList.some((permission) => hasPermission(permission, [ 'drift:*:*', 'drift:baselines:write', 'drift:*:write' ])),
                permissionsList.some((permission) => hasPermission(
                    permission, [ 'drift:*:*', 'drift:historical-system-profiles:read', 'drift:*:read' ])
                ),
                permissionsList.some((permission) => hasPermission(permission, [ 'inventory:*:*', 'inventory:*:read' ])),
                permissionsList.some((permission) => hasPermission(permission, [ 'drift:*:*', 'drift:notifications:write', 'drift:*:write' ])),
                permissionsList.some((permission) => hasPermission(permission, [ 'drift:*:*', 'drift:notifications:read', 'drift:*:read' ]))
            );
        })();

        chrome.on('GLOBAL_FILTER_UPDATE', ({ data }) => {
            const [ workloads, SID, tags ] = chrome?.mapGlobalFilter?.(data, false, true) || [];
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
                        inventoryRead: hasInventoryReadPermissions,
                        notificationsWrite: hasNotificationsWritePermissions,
                        notificationsRead: hasNotificationsReadPermissions
                    }
                }}>
                <NotificationsPortal store={ store }/>
                <Router />
            </PermissionContext.Provider>
            : null
    );
};

export default (App);
