/*eslint-disable camelcase*/
import editBaselineHelpers from '../helpers';
import editBaselineFixtures from './helpers.fixtures';

describe('edit baseline helpers', () => {
    it('buildNewFactData returns single fact data', () => {
        const isParent = undefined;
        const factName = 'virus';
        const factValue = 'COVID-19';
        const factData = [];

        expect(editBaselineHelpers.buildNewFactData(isParent, factName, factValue, factData)).toEqual(
            { name: 'virus', value: 'COVID-19' }
        );
    });

    it('buildNewFactData returns parent fact data', () => {
        const isParent = true;
        const factName = 'viruses';
        const factValue = '';
        const factData = [];

        expect(editBaselineHelpers.buildNewFactData(isParent, factName, factValue, factData)).toEqual(
            { name: 'viruses', values: []}
        );
    });

    it('buildNewFactData returns new sub fact data', () => {
        const isParent = undefined;
        const factName = 'virus';
        const factValue = 'SARS';
        const factData = { name: 'viruses', values: [
            { name: 'new-virus', value: 'COVID-19' }
        ]};

        expect(editBaselineHelpers.buildNewFactData(isParent, factName, factValue, factData)).toEqual(
            { name: 'viruses', values: [
                { name: 'new-virus', value: 'COVID-19' },
                { name: 'virus', value: 'SARS' }
            ]}
        );
    });

    it('buildEditedFactData returns edited fact', () => {
        const isParent = undefined;
        const originalFactName = 'old-virus';
        const factName = 'new-virus';
        const originalValueName = 'SARS';
        const factValue = 'COVID-19';
        const factData = { name: 'old-virus', value: 'SARS' };

        expect(editBaselineHelpers.buildEditedFactData(isParent, originalFactName, factName, originalValueName, factValue, factData)).toEqual(
            { name: 'new-virus', value: 'COVID-19' }
        );
    });

    it('buildEditedFactData returns edited category', () => {
        const isParent = true;
        const originalFactName = 'old-viruses';
        const factName = 'new-viruses';
        const originalValueName = undefined;
        const factValue = undefined;
        const factData = { name: 'old-virus', values: []};

        expect(editBaselineHelpers.buildEditedFactData(isParent, originalFactName, factName, originalValueName, factValue, factData)).toEqual(
            { name: 'new-viruses', values: []}
        );
    });

    it('buildEditedFactData returns edited sub fact', () => {
        const isParent = undefined;
        const originalFactName = 'old-virus';
        const factName = 'new-virus';
        const originalValueName = 'SARS';
        const factValue = 'COVID-19';
        const factData = { name: 'viruses', values: [
            { name: 'old-virus', value: 'SARS' }
        ]};

        expect(editBaselineHelpers.buildEditedFactData(isParent, originalFactName, factName, originalValueName, factValue, factData)).toEqual(
            { name: 'viruses', values: [
                { name: 'new-virus', value: 'COVID-19' }
            ]}
        );
    });

    it('buildEditedFactData with same subFact name just returns', () => {
        const isParent = undefined;
        const originalFactName = 'old-virus';
        const factName = 'old-virus';
        const originalValueName = 'SARS';
        const factValue = 'SARS';
        const factData = { name: 'viruses', values: [
            { name: 'old-virus', value: 'SARS' }
        ]};

        expect(editBaselineHelpers.buildEditedFactData(isParent, originalFactName, factName, originalValueName, factValue, factData)).toEqual(
            { name: 'viruses', values: [
                { name: 'old-virus', value: 'SARS' }
            ]}
        );
    });

    it('isAllSelected returns null', () => {
        let subFacts = JSON.parse(JSON.stringify(editBaselineFixtures.mockBaselineTableData1[2][2]));
        subFacts[0].selected = true;

        expect(editBaselineHelpers.isAllSelected(subFacts)).toEqual(null);
    });

    it('isAllSelected retuns false', () => {
        let subFacts = JSON.parse(JSON.stringify(editBaselineFixtures.mockBaselineTableData1[2][2]));
        expect(editBaselineHelpers.isAllSelected(subFacts)).toEqual(false);
    });

    it('isAllSelected returns true', () => {
        let subFacts = JSON.parse(JSON.stringify(editBaselineFixtures.mockBaselineTableData1[2][2]));
        subFacts[0].selected = true;
        subFacts[1].selected = true;
        subFacts[2].selected = true;
        subFacts[3].selected = true;
        subFacts[4].selected = true;
        subFacts[5].selected = true;
        subFacts[6].selected = true;
        subFacts[7].selected = true;
        subFacts[8].selected = true;

        expect(editBaselineHelpers.isAllSelected(subFacts)).toEqual(true);
    });

    it('isCategory returns false', () => {
        expect(editBaselineHelpers.isCategory(editBaselineFixtures.mockBaselineTableData1[0])).toEqual(false);
    });

    it('isCategory returns subfact false', () => {
        expect(editBaselineHelpers.isCategory(editBaselineFixtures.mockBaselineTableData1[2][2][0])).toEqual(false);
    });

    it('isCategory returns true', () => {
        expect(editBaselineHelpers.isCategory(editBaselineFixtures.mockBaselineTableData1[2])).toEqual(true);
    });

    it('makeAddFactPatch adds single fact', () => {
        let newFactData = { name: 'Elrond', value: 'Half-Elven' };
        let originalAPIBody = editBaselineFixtures.mockBaselineData1;
        let newAPIBody = {
            display_name: 'lotr-baseline',
            facts_patch: [
                { op: 'add', path: '/3', value:
                    { name: 'Elrond', value: 'Half-Elven' }
                }
            ]
        };

        expect(editBaselineHelpers.makeAddFactPatch(newFactData, originalAPIBody)).toEqual(newAPIBody);
    });

    it('makeAddFactPatch adds category', () => {
        let newFactData = { name: 'Sarumans Army', values: []};
        let originalAPIBody = editBaselineFixtures.mockBaselineData1;
        let newAPIBody = {
            display_name: 'lotr-baseline',
            facts_patch: [
                { op: 'add', path: '/3', value:
                    { name: 'Sarumans Army', values: []}
                }
            ]
        };

        expect(editBaselineHelpers.makeAddFactPatch(newFactData, originalAPIBody)).toEqual(newAPIBody);
    });

    it('makeAddFactPatch adds fact to category', () => {
        let newFactData = { name: 'The Fellowship of the Ring', values: [
            { name: 'Gollum', value: 'Smeagol' }
        ]};
        let originalAPIBody = editBaselineFixtures.mockBaselineData1;
        let newAPIBody = {
            display_name: 'lotr-baseline',
            facts_patch: [
                { op: 'add', path: '/2/values/0', value:
                    { name: 'Gollum', value: 'Smeagol' }
                }
            ]
        };

        expect(editBaselineHelpers.makeAddFactPatch(newFactData, originalAPIBody)).toEqual(newAPIBody);
    });

    it('makeAddFactPatch adds fact to category, not fact with same name', () => {
        let newFactData = { name: 'The Fellowship of the Ring', values: [
            { name: 'Gollum', value: 'Smeagol' }
        ]};
        let originalAPIBody = editBaselineFixtures.mockBaselineDataSameName1;
        let newAPIBody = {
            display_name: 'lotr-baseline',
            facts_patch: [
                { op: 'add', path: '/3/values/0', value:
                    { name: 'Gollum', value: 'Smeagol' }
                }
            ]
        };

        expect(editBaselineHelpers.makeAddFactPatch(newFactData, originalAPIBody)).toEqual(newAPIBody);
    });

    it('makeDeleteFactsPatch removes single fact', () => {
        let factsToDelete = JSON.parse(JSON.stringify(editBaselineFixtures.mockBaselineTableData1));
        factsToDelete[0].selected = true;
        let originalAPIBody = editBaselineFixtures.mockBaselineData1;
        let newAPIBody = {
            display_name: 'lotr-baseline',
            facts_patch: [
                { op: 'test', path: '/0', value:
                    { name: 'Sauron', value: 'the Dark Lord' }
                },
                { op: 'remove', path: '/0' }
            ]
        };

        expect(editBaselineHelpers.makeDeleteFactsPatch(factsToDelete, originalAPIBody)).toEqual(newAPIBody);
    });

    it('returns true if categories with same name', () => {
        let factA = editBaselineFixtures.newParentFact;
        let factB = editBaselineFixtures.newParentFact;
        expect(editBaselineHelpers.isSameFact(factA, factB)).toEqual(true);
    });

    it('returns true if facts with same name', () => {
        let factA = editBaselineFixtures.newFact;
        let factB = editBaselineFixtures.newFact;
        expect(editBaselineHelpers.isSameFact(factA, factB)).toEqual(true);
    });

    it('returns false if different category', () => {
        let factA = editBaselineFixtures.newParentFact;
        let factB = editBaselineFixtures.editParentFact;
        expect(editBaselineHelpers.isSameFact(factA, factB)).toEqual(false);
    });

    it('returns false if different fact', () => {
        let factA = editBaselineFixtures.newFact;
        let factB = editBaselineFixtures.editFact;
        expect(editBaselineHelpers.isSameFact(factA, factB)).toEqual(false);
    });

    it('returns false if category and fact', () => {
        let factA = editBaselineFixtures.newParentFact;
        let factB = editBaselineFixtures.newFact;
        expect(editBaselineHelpers.isSameFact(factA, factB)).toEqual(false);
    });

    it('returns false if category and fact with same name', () => {
        let factA = editBaselineFixtures.newParentFact;
        let factB = { name: 'new_parent_fact', value: 'new_value' };
        expect(editBaselineHelpers.isSameFact(factA, factB)).toEqual(false);
    });

    it('returns number selected', () => {
        let editBaselineTableData = editBaselineFixtures.mockBaselineTableDataSameName1;
        editBaselineTableData[1].selected = true;
        editBaselineTableData[3][2][3].selected = true;
        expect(editBaselineHelpers.findSelected(editBaselineTableData)).toEqual(2);
    });
});
/*eslint-enable camelcase*/
