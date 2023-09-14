import React, { useEffect, useState } from 'react';
import {
    Bullseye,
    Button,
    Modal,
    ModalVariant,
    Spinner
} from '@patternfly/react-core';
import NotificationsSystemsTable from '../../../SystemsTable/NotificationsSystemsTable';
import SystemsTable from '../../../SystemsTable/SystemsTable';
import DeleteNotificationModal from './DeleteNotificationModal/DeleteNotificationModal';
import { EmptyStateDisplay } from '../../../EmptyStateDisplay/EmptyStateDisplay';
import { LockIcon } from '@patternfly/react-icons';
import  getBaselineNotification  from '../../../../api';
import { toggleDeleteNotificationsModal, setSystemsToDelete, addNotifications } from './redux/actions.js';
export const SystemNotification = ({
    baselineId,
    baselineName,
    permissions,
    entities,
    driftClearFilters,
    fetchBaselineData,
    selectEntities,
    selectHistoricProfiles,
    setSelectedSystemIds,
    systemNotificationIds,
    systemNotificationLoaded,
    deleteNotificationsModalOpened,
    systemsToDelete
}) => {
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ systemsToAdd, setSystemsToAdd ] = useState([]);
    // permissions.baselinesRead === true && permissions.inventoryRead === true;

    console.log(fetchBaselineData, 'fetchBaselineData here');
    const fetchSystems = async (baselineId) => {
        await getBaselineNotification(baselineId);
        fetchBaselineData(baselineId);
    };

    useEffect(()=>{
        console.log(baselineId, 'baselineId here');
        fetchSystems(baselineId);
    }, []);

    const toggleModal = () => {
        setSelectedSystemIds([]);
        setIsModalOpen(!isModalOpen);
    };

    const buildSystemColumns = (isAddSystemNotifications) => {
        let columns = [
            {
                key: 'display_name',
                props: { width: isAddSystemNotifications ? 20 : null },
                title: 'Name'
            },
            {
                key: 'tags',
                props: { width: isAddSystemNotifications ? 10 : null, isStatic: true },
                title: 'Tags'
            },
            {
                key: 'updated',
                props: { width: isAddSystemNotifications ? 10 : null },
                title: 'Last seen'
            }
        ];

        if (!isAddSystemNotifications) {
            columns.push({
                key: 'system_notification',
                title: '',
                props: {
                    isStatic: true
                }
            });
        }

        return columns;
    };

    const deleteNotifications = async (systemIds) => {
        toggleDeleteNotificationsModal();
        setSystemsToDelete(systemIds);
    };

    const selectSystemsToAdd = (systemIds) => {
        let array = [ ...systemNotificationIds ];

        const newIds = systemIds.filter(
            (newId) => !array.some((existingId) => existingId === newId)
        );
        setSystemsToAdd(newIds);
    };

    const addNotification = async () => {
        await addNotifications(baselineId, systemsToAdd);
        setSystemsToAdd([]);

        toggleModal();
        fetchSystems(baselineId);
    };

    const buildNotificationsButton = () => {
        return (
            <Button
                key="add-baseline-notification"
                variant="primary"
                onClick={ toggleModal }
                ouiaId="add-baseline-notification-button"
            >
        Add associated system
            </Button>
        );
    };

    return (
        <React.Fragment>

            <>
                <DeleteNotificationModal
                    baselineId={ baselineId }
                    deleteNotifications={ deleteNotifications }
                    deleteNotificationsModalOpened={ deleteNotificationsModalOpened }
                    systemsToDelete={ systemsToDelete }
                    toggleDeleteNotificationsModal={ toggleDeleteNotificationsModal }
                    fetchSystems={ fetchSystems }
                />
                <Modal
                    className="drift"
                    width="1200px"
                    ouiaId="add-baseline-notification-modal"
                    variant={ ModalVariant.medium }
                    title={ 'Associate system with ' + baselineName }
                    isOpen={ isModalOpen }
                    onClose={ toggleModal }
                    actions={ [
                        <Button
                            key="confirm"
                            ouiaId="add-baseline-notification-button"
                            variant="primary"
                            onClick={ addNotification }
                        >
                Submit
                        </Button>,
                        <Button
                            key="cancel"
                            ouiaId="add-baseline-notification-cancel-button"
                            variant="link"
                            onClick={ toggleModal }
                        >
                Cancel
                        </Button>
                    ] }
                >
                    <SystemsTable
                        hasMultiSelect={ true }
                        permissions={ permissions }
                        entities={ entities }
                        selectVariant="checkbox"
                        systemNotificationIds={ systemNotificationIds }
                        baselineId={ baselineId }
                        isAddSystemNotifications={ true }
                        driftClearFilters={ driftClearFilters }
                        selectEntities={ selectEntities }
                        selectHistoricProfiles={ selectHistoricProfiles }
                        selectSystemsToAdd={ selectSystemsToAdd }
                        selectedSystemIds={ entities?.selectedSystemIds || [] }
                        systemColumns={ buildSystemColumns(true) }
                    />
                </Modal>
                {/* {systemNotificationLoaded ? (
                    <NotificationsSystemsTable
                        hasMultiSelect={ true }
                        permissions={ permissions }
                        selectVariant="checkbox"
                        systemNotificationIds={ systemNotificationIds }
                        baselineId={ baselineId }
                        toolbarButton={ buildNotificationsButton() }
                        driftClearFilters={ driftClearFilters }
                        selectEntities={ selectEntities }
                        selectHistoricProfiles={ selectHistoricProfiles }
                        onSystemSelect={ setSelectedSystemIds }
                        deleteNotifications={ deleteNotifications }
                        systemColumns={ buildSystemColumns() }
                    />
                ) : (
                    <Bullseye>
                        <Spinner size="xl" />
                    </Bullseye>
                )} */}
            </>

        </React.Fragment>
    );
};
