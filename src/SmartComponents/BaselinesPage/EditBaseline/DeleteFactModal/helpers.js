import editBaselineHelpers from '../helpers';

function countFacts(editBaselineTableData) {
    let categories = 0;
    let facts = 0;

    editBaselineTableData.forEach(function(fact) {
        if (fact.selected) {
            if (editBaselineHelpers.isCategory(fact)) {
                categories += 1;
            } else {
                facts += 1;
            }
        } else if (editBaselineHelpers.isCategory(fact)) {
            editBaselineHelpers.baselineSubFacts(fact).forEach(function(subFact) {
                if (subFact.selected) {
                    facts += 1;
                }
            });
        }
    });

    return { categories, facts };
}

export default {
    countFacts
};
