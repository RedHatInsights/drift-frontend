import types from './types';
import api from '../../../../api';

function patchBaseline(baselineId, apiBody) {
    return {
        type: types.PATCH_BASELINE,
        payload: api.patchBaselineData(baselineId, apiBody)
    };
}

export default {
    patchBaseline
};
