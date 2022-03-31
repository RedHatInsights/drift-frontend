import api from '../../../../api';
import { ASC, DESC } from '../../../../constants';

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

export function getNewNameSort(currentSort) {
    let newSort;

    if (currentSort === ASC) {
        newSort = DESC;
    } else {
        newSort = ASC;
    }

    return newSort;
}

export function getNewValueSort(currentSort) {
    let newSort;

    if (currentSort === ASC) {
        newSort = DESC;
    }
    else if (currentSort === DESC) {
        newSort = '';
    } else {
        newSort = ASC;
    }

    return newSort;
}

export default {
    toggleNotificationSwitch
};
