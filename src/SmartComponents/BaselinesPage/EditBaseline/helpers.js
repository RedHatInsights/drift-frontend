import React from 'react';
import jiff from 'jiff';
import FactKebab from './FactKebab/FactKebab';

/*eslint-disable react/prop-types*/
function renderKebab({ factName, factValue, fact, isCategory, isSubFact } = {}) {
    return (
        <td>
            <FactKebab
                factName={ factName }
                factValue={ factValue }
                fact={ fact }
                isCategory={ isCategory }
                isSubFact={ isSubFact }
            />
        </td>
    );
}
/*eslint-enable react/prop-types*/

function buildNewFactData(isParent, factName, factValue, factData) {
    let newFactData = {};
    let subFacts = [];

    if (factData && !Array.isArray(factData)) {
        factData.values.forEach(function(subFact) {
            subFacts.push(subFact);
        });
        subFacts.push({ name: factName, value: factValue });

        newFactData.name = factData.name;
        newFactData.values = subFacts;

        return newFactData;
    }

    newFactData.name = factName;
    if (isParent) {
        newFactData.values = [];
    } else {
        newFactData.value = factValue;
    }

    return newFactData;
}

function buildEditedFactData(isParent, originalFactName, factName, originalValueName, factValue, factData) {
    let newAPIBody = {};
    let subFacts = [];
    let originalSubFact = { name: originalFactName, value: originalValueName };

    if (isParent) {
        newAPIBody.name = factName;
        factData.values.forEach(function(subFact) {
            subFacts.push(subFact);
        });
        newAPIBody.values = subFacts;
    } else {
        if (factData.values && factValue !== '') {
            newAPIBody.name = factData.name;
            let newSubFact = { name: factName, value: factValue };

            factData.values.forEach(function(subFact) {
                if (subFact.name === originalSubFact.name && subFact.value === originalSubFact.value) {
                    return;
                }

                subFacts.push(subFact);
            });
            subFacts.push(newSubFact);
            newAPIBody.values = subFacts;
        } else {
            newAPIBody = { name: factName, value: factValue };
        }
    }

    return newAPIBody;
}

function buildDeletedSubFact(factToDelete, fact) {
    let newParentFact;
    let newSubFacts = [];

    fact.values.forEach(function(subFact) {
        if (subFact.name === factToDelete.name && subFact.value === factToDelete.value) {
            return;
        }

        newSubFacts.push(subFact);
    });

    newParentFact = { name: fact.name, values: newSubFacts };

    return newParentFact;
}

function makeDeleteFactPatch(factToDelete, originalAPIBody) {
    let op = 'remove';
    let path = '/';

    /*eslint-disable camelcase*/
    originalAPIBody.baseline_facts.forEach(function(fact, index) {
        if (fact.name === factToDelete.name) {
            path += index;
        }
    });

    let newAPIBody = {
        display_name: originalAPIBody.display_name,
        facts_patch: [{ op, path }]
    };
    /*eslint-enable camelcase*/

    return newAPIBody;
}

function makeDeleteSubFactPatch(factToDelete, parentFact, originalAPIBody) {
    let op = 'remove';
    let path = '';

    /*eslint-disable camelcase*/
    originalAPIBody.baseline_facts.forEach(function(fact, index) {
        if (fact.name === parentFact.name) {
            path = `/${index}/values`;
        }
    });

    parentFact.values.forEach(function(fact, index) {
        if (fact.name === factToDelete.name) {
            path += `/${index}`;
        }
    });

    let newAPIBody = {
        display_name: originalAPIBody.display_name,
        facts_patch: [{ op, path }]
    };
    /*eslint-enable camelcase*/

    return newAPIBody;
}

/*eslint-disable camelcase*/
function makeAddFactPatch(newFactData, originalAPIBody) {
    let op = 'add';
    let path = '/' + originalAPIBody.baseline_facts.length;
    let value = newFactData;
    let index;

    if (newFactData.hasOwnProperty('values') && newFactData.values.length > 0) {
        value = newFactData.values[newFactData.values.length - 1];

        for (let i = 0; i < originalAPIBody.baseline_facts.length; i += 1) {
            if (originalAPIBody.baseline_facts[i].name === newFactData.name) {
                index = i;
            }
        }

        path = `/${index}/values/${newFactData.values.length - 1}`;
    }

    let newAPIBody = {
        display_name: originalAPIBody.display_name,
        facts_patch: [{ op, path, value }]
    };

    return newAPIBody;
}
/*eslint-enable camelcase*/

function makeAddFactToCategoryPatch(newFactData, originalAPIBody, oldFactData) {
    if (newFactData === undefined || originalAPIBody === undefined) {
        return {};
    }

    let patchBody = makeAPIPatch(newFactData, originalAPIBody, oldFactData);

    patchBody.push(newFactData);

    let patch = makePatchBody(patchBody, originalAPIBody.baseline_facts);

    /*eslint-disable camelcase*/
    let newAPIBody = { display_name: originalAPIBody.display_name, facts_patch: patch };
    /*eslint-enable camelcase*/

    return newAPIBody;
}

function makeEditFactPatch(newFactData, originalAPIBody, oldFactData) {
    if (newFactData === undefined || originalAPIBody === undefined) {
        return {};
    }

    let patchBody = makeAPIPatch(newFactData, originalAPIBody, oldFactData);

    patchBody.push(newFactData);

    let patch = makePatchBody(patchBody, originalAPIBody.baseline_facts);

    /*eslint-disable camelcase*/
    let newAPIBody = { display_name: originalAPIBody.display_name, facts_patch: patch };
    /*eslint-enable camelcase*/

    return newAPIBody;
}

function makeAPIPatch(data, originalAPIBody, originalParentFact) {
    let patchBody = [];

    if (Array.isArray(originalParentFact) && originalParentFact.length === 0) {
        originalAPIBody.baseline_facts.forEach(function(fact) {
            if (fact.name !== data.name) {
                patchBody.push(fact);
            }
        });
    } else {
        originalAPIBody.baseline_facts.forEach(function(fact) {
            if (fact.name !== originalParentFact.name) {
                patchBody.push(fact);
            }
        });
    }

    return patchBody;
}

function makePatchBody(newAPIBody, originalAPIBody) {
    return jiff.diff(originalAPIBody, newAPIBody);
}

function findExpandedRow(fact, expandedRows) {
    let subfacts = [];

    expandedRows.forEach(function(row) {
        if (row === fact.name) {
            fact.values.forEach(function(subfact) {
                subfacts.push([ subfact.name, subfact.value ]);
            });
        }
    });

    return subfacts;
}

function filterBaselineData(baselineData, expandedRows) {
    let rows = [];
    let row;
    let subfacts = [];

    baselineData.forEach(function(fact) {
        row = [];
        row.push(fact.name);

        if (fact.values) {
            if (expandedRows.length > 0) {
                subfacts = findExpandedRow(fact, expandedRows);
            }

            if (subfacts.length > 0) {
                row.push(subfacts);
            } else {
                row.push('');
            }
        } else {
            row.push(fact.value);
        }

        rows.push(row);
    });

    return rows;
}

function toggleExpandedRow(expandedRows, factName) {
    if (expandedRows.includes(factName)) {
        expandedRows = expandedRows.filter(fact => fact !== factName);
    } else {
        expandedRows.push(factName);
    }

    return expandedRows;
}

export default {
    renderKebab,
    buildNewFactData,
    buildEditedFactData,
    buildDeletedSubFact,
    filterBaselineData,
    makeAddFactPatch,
    makeAddFactToCategoryPatch,
    makeEditFactPatch,
    makeDeleteFactPatch,
    makeDeleteSubFactPatch,
    toggleExpandedRow
};
