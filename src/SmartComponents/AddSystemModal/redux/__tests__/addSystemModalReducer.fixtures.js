/* eslint-disable camelcase */
import { BlueprintIcon, ServerIcon } from '@patternfly/react-icons';

const systemContent1 = ([
    {
        id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
        icon: <ServerIcon />,
        name: 'sgi-xe500-01.rhts.eng.bos.redhat.com'
    },
    {
        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2',
        icon: <ServerIcon />,
        name: 'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com'
    }
]);

const systemContent2 = ([
    {
        id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9',
        icon: <ServerIcon />,
        name: 'sgi-xe500-01.rhts.eng.bos.redhat.com'
    }
]);

const systemContent3 = ([
    {
        id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2',
        icon: <ServerIcon />,
        name: 'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com'
    }
]);

const systems1 = ([
    { id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' }
]);

const systems2 = ([
    { id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9' },
    { id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2' }
]);

const systems3 = ([
    { id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2' }
]);

const baselineContent1 = ([
    { id: 'abcd1234', icon: <BlueprintIcon />, name: 'baseline1' }
]);

const baselineContent2 = ([
    { id: 'abcd1234', icon: <BlueprintIcon />, name: 'baseline1' },
    { id: 'efgh5678', icon: <BlueprintIcon />, name: 'baseline2' }
]);

const baselineContent3 = ([
    {
        id: '9bbbefcc-8f23-4d97-07f2-142asdl234e9',
        icon: <BlueprintIcon />,
        name: 'baseline1'
    },
    {
        id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29',
        icon: <BlueprintIcon />,
        name: 'baseline2'
    }
]);

const baselines1 = ([
    { id: 'fdmk59dj-fn42-dfjk-alv3-bmn2854mnn29' }
]);

const hspContent1 = ({
    system_name: 'system1',
    captured_date: '2019-01-15T14:53:15.886891Z',
    id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
    system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
});

const hspContent2 = ({
    system_name: 'system1',
    captured_date: '2019-01-15T15:25:16.304899Z',
    id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
    system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
});

const hspContent3 = ([
    {
        system_name: 'system1',
        captured_date: '2019-01-15T14:53:15.886891Z',
        id: '9bbbefcc-8f23-4d97-07f2-142asdl234e8',
        system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
    },
    {
        system_name: 'system1',
        captured_date: '2019-01-15T15:25:16.304899Z',
        id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27',
        system_id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9'
    }
]);

const historicalProfiles1 = ([
    { id: 'edmk59dj-fn42-dfjk-alv3-bmn2854mnn27' }
]);

const data1 = ({
    id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', selected: true
});

const data2 = ({
    id: 0, selected: true
});

const data3 = ({
    id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', selected: false
});

const rows = ([
    { id: '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9', display_name: 'sgi-xe500-01.rhts.eng.bos.redhat.com' },
    { id: 'f35b1e1d-d231-43f2-8e4f-8f9cb01e3aa2', display_name: 'ibm-x3650m4-03-vm03.lab.eng.brq.redhat.com' }
]);

export default {
    systemContent1,
    systemContent2,
    systemContent3,
    systems1,
    systems2,
    systems3,
    baselineContent1,
    baselineContent2,
    baselineContent3,
    baselines1,
    hspContent1,
    hspContent2,
    hspContent3,
    historicalProfiles1,
    data1,
    data2,
    data3,
    rows
};
/* eslint-enable camelcase */
