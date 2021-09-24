import api from '../../../../api';

/*eslint-disable camelcase*/
async function toggleNotificationSwitch(
    baselineId, body, toggleNotificationPending, toggleNotificationFulfilled, toggleNotificationRejected
) {
    toggleNotificationPending();

    try {
        const data = await api.patchBaselineData(baselineId, body);
        toggleNotificationFulfilled(data);
    } catch (error) {
        toggleNotificationRejected(error, baselineId, body.display_name);
    }
}

/*eslint-enable camelcase*/

export default {
    toggleNotificationSwitch
};
