const allStatesTrue = [
    { filter: 'SAME', display: 'Same', selected: true },
    { filter: 'DIFFERENT', display: 'Different', selected: true },
    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
];

const sameStateFalse = ([
    { filter: 'SAME', display: 'Same', selected: false },
    { filter: 'DIFFERENT', display: 'Different', selected: true },
    { filter: 'INCOMPLETE_DATA', display: 'Incomplete data', selected: true }
]);

export default {
    allStatesTrue,
    sameStateFalse
};
