/*eslint-disable camelcase*/
const mockBaselineData1 = {
    account: '12345678',
    created: '2019-10-17T16:20:06.050710Z',
    display_name: 'lotr-baseline',
    fact_count: 3,
    id: 'jf8alskj-jf74-aje8-ke83-jf84ldjru439k',
    updated: '2020-02-06T21:48:30.661510Z',
    baseline_facts: [
        { name: 'Sauron', value: 'the Dark Lord' },
        { name: 'Galadriel', value: 'the Elven Queen' },
        { name: 'The Fellowship of the Ring', values: [
            { name: 'Frodo', value: 'Baggins' },
            { name: 'Samwise', value: 'Gamgee' },
            { name: 'Gandalf', value: 'the Grey' },
            { name: 'Meriadoc', value: 'Brandybuck' },
            { name: 'Peregrin', value: 'Took' },
            { name: 'Gimli', value: 'son of Gloin' },
            { name: 'Legolas', value: 'Greenleaf' },
            { name: 'Boromir', value: 'son of Denethor' },
            { name: 'Aragorn', value: 'son of Arathorn' }
        ]}
    ]
};

const mockBaselineDataSameName1 = {
    account: '12345678',
    created: '2019-10-17T16:20:06.050710Z',
    display_name: 'lotr-baseline',
    fact_count: 3,
    id: 'jf8alskj-jf74-aje8-ke83-jf84ldjru439k',
    updated: '2020-02-06T21:48:30.661510Z',
    baseline_facts: [
        { name: 'Sauron', value: 'the Dark Lord' },
        { name: 'Galadriel', value: 'the Elven Queen' },
        { name: 'The Fellowship of the Ring', value: 'same name as category' },
        { name: 'The Fellowship of the Ring', values: [
            { name: 'Frodo', value: 'Baggins' },
            { name: 'Samwise', value: 'Gamgee' },
            { name: 'Gandalf', value: 'the Grey' },
            { name: 'Meriadoc', value: 'Brandybuck' },
            { name: 'Peregrin', value: 'Took' },
            { name: 'Gimli', value: 'son of Gloin' },
            { name: 'Legolas', value: 'Greenleaf' },
            { name: 'Boromir', value: 'son of Denethor' },
            { name: 'Aragorn', value: 'son of Arathorn' }
        ]}
    ]
};

const mockBaselineTableData1 = [
    [ 0, 'Sauron', 'the Dark Lord' ],
    [ 1, 'Galadriel', 'the Elven Queen' ],
    [ 2, 'The Fellowship of the Ring',
        [
            [ 3, 'Frodo', 'Baggins' ],
            [ 4, 'Samwise', 'Gamgee' ],
            [ 5, 'Gandalf', 'the Grey' ],
            [ 6, 'Meriadoc', 'Brandybuck' ],
            [ 7, 'Peregrin', 'Took' ],
            [ 8, 'Gimli', 'son of Gloin' ],
            [ 9, 'Legolas', 'Greenleaf' ],
            [ 10, 'Boromir', 'son of Denethor' ],
            [ 11, 'Aragorn', 'son of Arathorn' ]
        ]
    ]
];

const mockBaselineTableDataSameName1 = [
    [ 0, 'Sauron', 'the Dark Lord' ],
    [ 1, 'Galadriel', 'the Elven Queen' ],
    [ 2, 'The Fellowship of the Ring', 'same name as category' ],
    [ 3, 'The Fellowship of the Ring',
        [
            [ 4, 'Frodo', 'Baggins' ],
            [ 5, 'Samwise', 'Gamgee' ],
            [ 6, 'Gandalf', 'the Grey' ],
            [ 7, 'Meriadoc', 'Brandybuck' ],
            [ 8, 'Peregrin', 'Took' ],
            [ 9, 'Gimli', 'son of Gloin' ],
            [ 10, 'Legolas', 'Greenleaf' ],
            [ 11, 'Boromir', 'son of Denethor' ],
            [ 12, 'Aragorn', 'son of Arathorn' ]
        ]
    ]
];

const mockBaselineAPIBody = {
    id: '38gnw73l-fn36-5829-1287-2m5ghs46801c',
    display_name: 'lotr_baseline',
    baseline_facts: [
        { name: 'Sauron', value: 'the Dark Lord' },
        { name: 'Galadriel', value: 'the Elven Queen' },
        {
            name: 'The Fellowship of the Ring',
            values: [
                { name: 'Frodo', value: 'Baggins' },
                { name: 'Samwise', value: 'Gamgee' },
                { name: 'Gandalf', value: 'the Grey' },
                { name: 'Meriadoc', value: 'Brandybuck' },
                { name: 'Peregrin', value: 'Took' },
                { name: 'Gimli', value: 'song of Gloin' },
                { name: 'Legolas', value: 'Greenleaf' },
                { name: 'Boromir', value: 'son of Denethor' },
                { name: 'Aragorn', value: 'son of Arathorn' }
            ]
        }
    ]
};

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

const csvContent = 'lotr-baseline\n\
Fact,Value\n\
Sauron,the Dark Lord\n\
Galadriel,the Elven Queen\n\
The Fellowship of the Ring\n\
    Frodo,Baggins\n\
    Samwise,Gamgee\n\
    Gandalf,the Grey\n\
    Meriadoc,Brandybuck\n\
    Peregrin,Took\n\
    Gimli,son of Gloin\n\
    Legolas,Greenleaf\n\
    Boromir,son of Denethor\n\
    Aragorn,son of Arathorn\n\
';

const jsonContent = [
    { fact: 'Sauron', value: 'the Dark Lord' },
    { fact: 'Galadriel', value: 'the Elven Queen' },
    { fact: 'The Fellowship of the Ring', sub_facts: [
        { fact: 'Frodo', value: 'Baggins' },
        { fact: 'Samwise', value: 'Gamgee' },
        { fact: 'Gandalf', value: 'the Grey' },
        { fact: 'Meriadoc', value: 'Brandybuck' },
        { fact: 'Peregrin', value: 'Took' },
        { fact: 'Gimli', value: 'son of Gloin' },
        { fact: 'Legolas', value: 'Greenleaf' },
        { fact: 'Boromir', value: 'son of Denethor' },
        { fact: 'Aragorn', value: 'son of Arathorn' }
    ]}
];
/*eslint-enable camelcase*/

export default {
    mockBaselineData1,
    mockBaselineDataSameName1,
    mockBaselineTableData1,
    mockBaselineTableDataSameName1,
    mockBaselineAPIBody,
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
    editParentFactAPIBody,
    csvContent,
    jsonContent
};
