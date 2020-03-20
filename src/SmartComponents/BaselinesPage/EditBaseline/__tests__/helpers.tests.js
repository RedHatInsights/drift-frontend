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
        const factData = { name: 'viruses', values: []};

        expect(editBaselineHelpers.buildNewFactData(isParent, factName, factValue, factData)).toEqual(
            { name: 'viruses', values: [
                { name: 'virus', value: 'SARS' }
            ]}
        );
    });

    it('isAllSelected retuns false', () => {
        editBaselineFixtures.mockBaselineTableData1[0].selected = true;
        editBaselineFixtures.mockBaselineTableData1[1].selected = true;

        expect(editBaselineHelpers.isAllSelected(editBaselineFixtures.mockBaselineTableData1)).toEqual(false);
    });

    it('isAllSelected returns true', () => {
        editBaselineFixtures.mockBaselineTableData1[0].selected = true;
        editBaselineFixtures.mockBaselineTableData1[1].selected = true;
        editBaselineFixtures.mockBaselineTableData1[2].selected = true;

        expect(editBaselineHelpers.isAllSelected(editBaselineFixtures.mockBaselineTableData1)).toEqual(true);
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
});
