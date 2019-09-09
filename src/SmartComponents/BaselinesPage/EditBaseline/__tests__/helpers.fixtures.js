/*eslint-disable camelcase*/
const originalAPIBody = {
    id: '4634f207-eb91-4689-9843-81c72285840a',
    display_name: 'testing_baseline',
    baseline_facts: [
        { name: 'fact', value: 'value' },
        {
            name: 'parent_fact',
            values: [
                { name: 'first_fact', value: '1' },
                { name: 'second_fact', value: '2' }
            ]
        },
        {
            name: 'another_parent_fact',
            values: [
                { name: 'first_child', value: '1' },
                { name: 'second_child', value: '2' }
            ]
        }
    ]
};

const rows = [
    {
        cells: [ 'fact', 'value' ]
    },
    {
        cells: [ 'parent_fact', '' ]
    },
    {
        cells: [ null ],
        data: {
            modules: [ 'first_fact', '1' ]
        },
        parent: 1
    },
    {
        cells: [ null ],
        data: {
            modules: [ 'second_fact', '2' ]
        },
        parent: 1
    },
    {
        cells: [ 'another_parent_fact', '' ]
    },
    {
        cells: [ null ],
        data: {
            modules: [ 'first_child', '1' ]
        },
        parent: 4
    },
    {
        cells: [ null ],
        data: {
            modules: [ 'second_child', '2' ]
        },
        parent: 4
    }
];

const childFactsOne = [
    { name: 'first_fact', value: '1' },
    { name: 'second_fact', value: '2' }
];

const childFactsTwo = [
    { name: 'first_child', value: '1' },
    { name: 'second_child', value: '2' }
];

const newFact = {
    name: 'new_fact', value: 'new_value'
};

const editFact = {
    name: 'fact', value: 'newer_value'
};

const newParentFact = {
    name: 'new_parent_fact', values: []
};

const editParentFact = {
    name: 'parent_fact',
    values: [
        { name: 'first_fact', value: 'edited_fact' },
        { name: 'second_fact', value: '2' }
    ]
};

const newFactAPIBody = {
    display_name: 'testing_baseline',
    facts_patch: [{
        context: undefined,
        op: 'add',
        path: '/3',
        value: {
            name: 'new_fact', value: 'new_value'
        }
    }]
};

const editFactAPIBody = {
    display_name: 'testing_baseline',
    facts_patch: [
        {
            context: undefined,
            op: 'test',
            path: '/0',
            value: {
                name: 'fact', value: 'value'
            }
        },
        {
            context: undefined,
            op: 'remove',
            path: '/0'
        },
        {
            context: undefined,
            op: 'add',
            path: '/2',
            value: {
                name: 'fact', value: 'newer_value'
            }
        }
    ]
};

const newParentFactAPIBody = {
    display_name: 'testing_baseline',
    facts_patch: [{
        context: undefined,
        op: 'add',
        path: '/3',
        value: {
            name: 'new_parent_fact',
            values: []
        }
    }]
};

const editParentFactAPIBody = {
    display_name: 'testing_baseline',
    facts_patch: [
        {
            context: undefined,
            op: 'test',
            path: '/1',
            value: {
                name: 'parent_fact',
                values: [
                    { name: 'first_fact', value: '1' },
                    { name: 'second_fact', value: '2' }
                ]
            }
        },
        {
            context: undefined,
            op: 'remove',
            path: '/1'
        },
        {
            context: undefined,
            op: 'add',
            path: '/2',
            value: {
                name: 'parent_fact',
                values: [
                    { name: 'first_fact', value: 'edited_fact' },
                    { name: 'second_fact', value: '2' }
                ]
            }
        }
    ]
};
/*eslint-enable camelcase*/

export default {
    originalAPIBody,
    rows,
    childFactsOne,
    childFactsTwo,
    newFact,
    editFact,
    newParentFact,
    editParentFact,
    newFactAPIBody,
    editFactAPIBody,
    newParentFactAPIBody,
    editParentFactAPIBody
};
