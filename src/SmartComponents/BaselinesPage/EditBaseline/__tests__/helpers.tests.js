import editBaselineHelpers from '../helpers';
import editBaselineFixtures from './helpers.fixtures';

describe('edit baseline helpers', () => {
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
