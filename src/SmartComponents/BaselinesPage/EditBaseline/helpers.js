import jiff from 'jiff';

function buildParentFact(rows, parentRowId) {
    let childRows = [];
    if (rows.length === 0 || parentRowId === undefined) {
        return childRows;
    } else {
        childRows = rows.filter(function(row) {
            return row.parent === parentRowId;
        })
        .map(function(row) {
            return { name: row.data.modules[0], value: row.data.modules[1] };
        });
    }

    return childRows;
}

function makeAPIPatch(rowData, originalAPIBody) {
    if (rowData === undefined || originalAPIBody === undefined) {
        return {};
    }

    /*eslint-disable camelcase*/
    let patchBody = [];
    let newAPIBody = { display_name: originalAPIBody.display_name };
    originalAPIBody.baseline_facts.forEach(function(fact) {
        if (fact.name !== rowData.name) {
            patchBody.push(fact);
        }
    });

    patchBody.push(rowData);

    let patch = makePatchBody(patchBody, originalAPIBody.baseline_facts);

    newAPIBody.facts_patch = patch;
    /*eslint-enable camelcase*/
    return newAPIBody;
}

function makePatchBody(newAPIBody, originalAPIBody) {
    return jiff.diff(originalAPIBody, newAPIBody);
}

export default {
    buildParentFact,
    makeAPIPatch
};
