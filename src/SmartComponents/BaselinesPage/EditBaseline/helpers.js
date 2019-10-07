import React from 'react';
import jiff from 'jiff';
import FactKebab from './FactKebab/FactKebab';

function renderKebab(factName, factValue, fact) {
    return <td>
        { <FactKebab
            factName={ factName }
            factValue={ factValue }
            fact={ fact } />
        }
    </td>;
}

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

function makeDeleteFactPatch(factToDelete, originalAPIBody, parentFactData) {
    if (factToDelete === undefined || originalAPIBody === undefined) {
        return {};
    }

    let patchBody = makeAPIPatch(factToDelete, originalAPIBody, parentFactData);
    if (factToDelete.values) {
        patchBody.push(factToDelete);
    }

    let patch = makePatchBody(patchBody, originalAPIBody.baseline_facts);

    /*eslint-disable camelcase*/
    let newAPIBody = { display_name: originalAPIBody.display_name, facts_patch: patch };
    /*eslint-enable camelcase*/

    return newAPIBody;
}

function makeAddFactPatch(newFactData, originalAPIBody, oldFactData) {
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

export default {
    renderKebab,
    buildNewFactData,
    buildEditedFactData,
    buildDeletedSubFact,
    makeAddFactPatch,
    makeDeleteFactPatch
};
