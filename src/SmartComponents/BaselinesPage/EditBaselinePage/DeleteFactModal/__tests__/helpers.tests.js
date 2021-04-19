import deleteFactModalHelpers from '../helpers';
import editBaselineFixtures from '../../EditBaseline/__tests__/helpers.fixtures';

describe('delete fact modal helpers', () => {
    beforeEach(() => {
        editBaselineFixtures.mockBaselineTableData1.forEach(function(fact) {
            fact.selected = false;
        });
    });

    it('countFacts counts category and fact', () => {
        editBaselineFixtures.mockBaselineTableData1[0].selected = true;
        editBaselineFixtures.mockBaselineTableData1[2].selected = true;

        expect(deleteFactModalHelpers.countFacts(editBaselineFixtures.mockBaselineTableData1)).toEqual({
            categories: 1,
            facts: 1
        });
    });

    it('countFacts counts subFacts', () => {
        editBaselineFixtures.mockBaselineTableData1[2][2][0].selected = true;
        editBaselineFixtures.mockBaselineTableData1[2][2][4].selected = true;

        expect(deleteFactModalHelpers.countFacts(editBaselineFixtures.mockBaselineTableData1)).toEqual({
            categories: 0,
            facts: 2
        });
    });
});
