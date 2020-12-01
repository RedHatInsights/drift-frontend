const allStatesTrue = [
    {
        filter: 'SAME',
        display: 'Same',
        selected: true
    },
    {
        filter: 'DIFFERENT',
        display: 'Different',
        selected: true
    },
    {
        filter: 'INCOMPLETE_DATA',
        display: 'Incomplete data',
        selected: true
    }
];

const allStatesFalse = [
    {
        filter: 'SAME',
        display: 'Same',
        selected: false
    },
    {
        filter: 'DIFFERENT',
        display: 'Different',
        selected: false
    },
    {
        filter: 'INCOMPLETE_DATA',
        display: 'Incomplete data',
        selected: false
    }
];

const sameStateTrue = ([
    {
        filter: 'SAME',
        display: 'Same',
        selected: true
    },
    {
        filter: 'DIFFERENT',
        display: 'Different',
        selected: false
    },
    {
        filter: 'INCOMPLETE_DATA',
        display: 'Incomplete data',
        selected: false
    }
]);

const diffStateTrue = ([
    {
        filter: 'SAME',
        display: 'Same',
        selected: false
    },
    {
        filter: 'DIFFERENT',
        display: 'Different',
        selected: true
    },
    {
        filter: 'INCOMPLETE_DATA',
        display: 'Incomplete data',
        selected: false
    }
]);

const incompleteStateTrue = ([
    {
        filter: 'SAME',
        display: 'Same',
        selected: false
    },
    {
        filter: 'DIFFERENT',
        display: 'Different',
        selected: false
    },
    {
        filter: 'INCOMPLETE_DATA',
        display: 'Incomplete data',
        selected: true
    }
]);

const sameStateFalse = ([
    {
        filter: 'SAME',
        display: 'Same',
        selected: false
    },
    {
        filter: 'DIFFERENT',
        display: 'Different',
        selected: true
    },
    {
        filter: 'INCOMPLETE_DATA',
        display: 'Incomplete data',
        selected: true
    }
]);

const diffStateFalse = ([
    {
        filter: 'SAME',
        display: 'Same',
        selected: true
    },
    {
        filter: 'DIFFERENT',
        display: 'Different',
        selected: false
    },
    {
        filter: 'INCOMPLETE_DATA',
        display: 'Incomplete data',
        selected: true
    }
]);

const incompleteStateFalse = ([
    {
        filter: 'SAME',
        display: 'Same',
        selected: true
    },
    {
        filter: 'DIFFERENT',
        display: 'Different',
        selected: true
    },
    {
        filter: 'INCOMPLETE_DATA',
        display: 'Incomplete data',
        selected: false
    }
]);

export default {
    allStatesTrue,
    allStatesFalse,
    sameStateTrue,
    diffStateTrue,
    incompleteStateTrue,
    sameStateFalse,
    diffStateFalse,
    incompleteStateFalse
};
