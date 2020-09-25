import React from 'react';
import jiff from 'jiff';
import FactKebab from './FactKebab/FactKebab';

/*eslint-disable react/prop-types*/
function renderKebab({ factName, factValue, factData, isCategory, isSubFact, hasWritePermissions } = {}) {
    return (
        hasWritePermissions
            ? <td>
                <FactKebab
                    factName={ factName }
                    factValue={ factValue }
                    fact={ factData }
                    isCategory={ isCategory }
                    isSubFact={ isSubFact }
                />
            </td>
            : null
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

function makeDeleteFactsPatch(factsToDelete, originalAPIBody) {
    let unselectedFacts = [];

    factsToDelete.forEach(function(fact, index) {
        if (!fact.selected) {
            if (isCategory(fact)) {
                let newAPIBody;
                let unselectedSubFacts = [];

                baselineSubFacts(fact).forEach(function(subFact, idx) {
                    if (!subFact.selected) {
                        unselectedSubFacts.push(originalAPIBody.baseline_facts[index].values[idx]);
                    }
                });

                newAPIBody = {
                    name: originalAPIBody.baseline_facts[index].name,
                    values: unselectedSubFacts
                };

                unselectedFacts.push(newAPIBody);
            } else {
                unselectedFacts.push(originalAPIBody.baseline_facts[index]);
            }
        }
    });

    let patch = makePatchBody(unselectedFacts, originalAPIBody.baseline_facts);

    /*eslint-disable camelcase*/
    let newAPIBody = { display_name: originalAPIBody.display_name, facts_patch: patch };
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

    let newFactBody = makeAPIPatch(newFactData, originalAPIBody, oldFactData);

    newFactBody.push(newFactData);

    let patch = makePatchBody(newFactBody, originalAPIBody.baseline_facts);

    /*eslint-disable camelcase*/
    let newAPIBody = { display_name: originalAPIBody.display_name, facts_patch: patch };
    /*eslint-enable camelcase*/

    return newAPIBody;
}

function makeEditFactPatch(newFactData, originalAPIBody, oldFactData) {
    if (newFactData === undefined || originalAPIBody === undefined) {
        return {};
    }

    let editedFactBody = makeAPIPatch(newFactData, originalAPIBody, oldFactData);

    editedFactBody.push(newFactData);

    let patch = makePatchBody(editedFactBody, originalAPIBody.baseline_facts);

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

function buildBaselineTableData(baselineData) {
    let rows = [];
    let row;
    let id = 0;

    if (baselineData) {
        baselineData.forEach(function(fact) {
            row = [];
            row.push(id);
            row.push(fact.name);
            id += 1;

            if (fact.values) {
                let subfacts = [];
                if (fact.values.length > 0) {
                    fact.values.forEach(function(subFact) {
                        let subfact = [];
                        subfact.push(id);
                        subfact.push(subFact.name);
                        subfact.push(subFact.value);
                        id += 1;
                        subfacts.push(subfact);
                    });

                    row.push(subfacts);
                } else {
                    row.push([]);
                }
            } else {
                row.push(fact.value);
            }

            rows.push(row);
        });
    }

    return rows;
}

function toggleExpandedRow(expandedRows, factName) {
    let newExpandedRows;

    if (expandedRows.includes(factName)) {
        newExpandedRows = expandedRows.filter(fact => fact !== factName);
    } else {
        newExpandedRows = expandedRows.slice();
        newExpandedRows.splice(0, 0, factName);
    }

    return newExpandedRows;
}

function isAllSelected(data) {
    let allSelected = true;

    data.forEach(function(fact) {
        if (!fact.selected) {
            allSelected = false;
        }
    });

    return allSelected;
}

function isCategory(fact) {
    let subfacts = fact[2];
    if (Array.isArray(subfacts)) {
        return true;
    } else {
        return false;
    }
}

function baselineSubFacts(fact) {
    return fact[2];
}

function findFactCount(editBaselineTableData) {
    let totalFacts = 0;

    editBaselineTableData.forEach(function(fact) {
        if (Array.isArray(fact[2])) {
            totalFacts += fact[2].length;
        } else {
            totalFacts += 1;
        }
    });

    return totalFacts;
}

function findSelected(editBaselineTableData) {
    let selected = 0;

    editBaselineTableData.forEach(function(fact) {
        if (Array.isArray(fact[2])) {
            fact[2].forEach(function(subFact) {
                if (subFact.selected === true) {
                    selected += 1;
                }
            });
        } else {
            if (fact.selected === true) {
                selected += 1;
            }
        }
    });

    return selected;
}

function convertDataToCSV(data, baselineData) {
    if (data === null || !data.length) {
        return null;
    }

    let columnDelimiter = ',';
    let lineDelimiter = '\n';

    /*eslint-disable camelcase*/
    let headers = 'Fact,Value,';
    let result = baselineData.display_name + lineDelimiter + headers + lineDelimiter;
    /*eslint-enable camelcase*/

    data.forEach(function(row) {
        row.forEach(function(rowData) {
            if (row[0] === rowData) {
                return;
            }

            if (Array.isArray(rowData)) {
                rowData.forEach(function(subFact) {
                    result += lineDelimiter;
                    result += '    ';
                    subFact.forEach(function(subFactData) {
                        if (subFact[0] === subFactData) {
                            return;
                        }

                        result += subFactData;
                        result += columnDelimiter;
                    });
                });
            } else {
                result += rowData;
                result += columnDelimiter;
            }
        });

        result += lineDelimiter;
    });

    return result;
}

export default {
    renderKebab,
    buildNewFactData,
    buildEditedFactData,
    buildDeletedSubFact,
    buildBaselineTableData,
    makeDeleteFactsPatch,
    makeAddFactPatch,
    makeAddFactToCategoryPatch,
    makeEditFactPatch,
    makeDeleteFactPatch,
    makeDeleteSubFactPatch,
    toggleExpandedRow,
    isAllSelected,
    isCategory,
    baselineSubFacts,
    findFactCount,
    findSelected,
    convertDataToCSV
};
