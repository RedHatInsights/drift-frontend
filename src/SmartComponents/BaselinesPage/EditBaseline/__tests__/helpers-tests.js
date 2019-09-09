import editBaselineHelpers from '../helpers';
import editBaselineFixtures from './helpers.fixtures';

describe('build parent fact', () => {
    it('should return child rows of parent 1', () => {
        expect(editBaselineHelpers.buildParentFact(editBaselineFixtures.rows, 1)
        ).toEqual(editBaselineFixtures.childFactsOne);
    });

    it('should return child rows of parent 4', () => {
        expect(editBaselineHelpers.buildParentFact(editBaselineFixtures.rows, 4)
        ).toEqual(editBaselineFixtures.childFactsTwo);
    });

    it('should return empty array when empty rows', () => {
        expect(editBaselineHelpers.buildParentFact([], 0)
        ).toEqual([]);
    });

    it('should return empty array when undefined parentRowId', () => {
        expect(editBaselineHelpers.buildParentFact(editBaselineFixtures.rows, undefined)
        ).toEqual([]);
    });

    it('should return empty array when no data', () => {
        expect(editBaselineHelpers.buildParentFact([], undefined)
        ).toEqual([]);
    });

    it('should return empty array when wrong parentRowId', () => {
        expect(editBaselineHelpers.buildParentFact(editBaselineFixtures.rows, 0)
        ).toEqual([]);
    });
});

describe('make API patch', () => {
    it('should return empty if no rowData', () => {
        expect(editBaselineHelpers.makeAPIPatch(
            undefined,
            editBaselineFixtures.originalAPIBody)
        ).toEqual({});
    });

    it('should return empty if no originalAPIBody', () => {
        expect(editBaselineHelpers.makeAPIPatch(
            editBaselineFixtures.newFact,
            undefined)
        ).toEqual({});
    });

    it('should return new fact patch API body', () => {
        expect(editBaselineHelpers.makeAPIPatch(
            editBaselineFixtures.newFact,
            editBaselineFixtures.originalAPIBody)
        ).toEqual(editBaselineFixtures.newFactAPIBody);
    });

    it('should return new parent fact API body', () => {
        expect(editBaselineHelpers.makeAPIPatch(
            editBaselineFixtures.newParentFact,
            editBaselineFixtures.originalAPIBody)
        ).toEqual(editBaselineFixtures.newParentFactAPIBody);
    });

    it('should return edited fact API body', () => {
        expect(editBaselineHelpers.makeAPIPatch(
            editBaselineFixtures.editFact,
            editBaselineFixtures.originalAPIBody)
        ).toEqual(editBaselineFixtures.editFactAPIBody);
    });

    it('should return edited parent fact API body', () => {
        expect(editBaselineHelpers.makeAPIPatch(
            editBaselineFixtures.editParentFact,
            editBaselineFixtures.originalAPIBody)
        ).toEqual(editBaselineFixtures.editParentFactAPIBody);
    });
});

