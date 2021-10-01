import helpers from '../helpers';
import stateFiltersFixtures from './state-filter.fixtures';
import { compareReducerPayloadWithCategory, compareReducerPayloadWithMultiFact, compareReducerPayloadWithUppercase,
    sortedPayloadWithMultiFactAscDesc, sortedPayloadWithMultiFactAscAsc, compareReducerPayloadWithUpperCaseSubFact,
    comparisonCSV, comparisonJSON } from './reducer.fixtures';
import { filteredCategory, filteredCategoryAndFact, filteredUpperCaseFact, filteredUpperCaseSubFact } from './reducer.fact-filter-fixtures';
import { multivalues, comparisonsWithMultivalues, multivaluesWithTooltips, comparisonsWithMultivaluesTooltips } from './multiFact-filter-fixtures';

describe('helpers', () => {
    it('should return SAME filter selected true getStateSelected', () => {
        const state = 'SAME';
        const stateFilters = stateFiltersFixtures.sameStateTrue;
        expect(helpers.getStateSelected(state, stateFilters)).toEqual(stateFiltersFixtures.sameStateTrue[0]);
    });

    it('should return undefined when state is not selected', () => {
        const state = 'SAME';
        const stateFilters = stateFiltersFixtures.allStatesFalse;
        expect(helpers.getStateSelected(state, stateFilters)).toEqual(undefined);
    });

    it('should return SAME filter true getState', () => {
        const state = 'SAME';
        const stateFilters = stateFiltersFixtures.sameStateTrue;
        expect(helpers.getState(state, stateFilters)).toEqual(stateFiltersFixtures.sameStateTrue[0]);
    });

    it('should return SAME filter false getState', () => {
        const state = 'SAME';
        const stateFilters = stateFiltersFixtures.sameStateFalse;
        expect(helpers.getState(state, stateFilters)).toEqual(stateFiltersFixtures.sameStateFalse[0]);
    });

    it('should return INCOMPLETE_DATA filter on obfuscated getState', () => {
        const state = 'INCOMPLETE_DATA_OBFUSCATED';
        const stateFilters = stateFiltersFixtures.allStatesTrue;
        expect(helpers.getState(state, stateFilters)).toEqual(stateFiltersFixtures.allStatesTrue[2]);
    });

    it('should set tooltip when reference set', () => {
        const data = { name: 'system1', state: 'DIFFERENT' };
        const referenceId = 'abcd-1234-efgh-5678';
        helpers.setTooltip(data, stateFiltersFixtures.allStatesTrue, referenceId);
        expect(data.tooltip).toEqual('Different - At least one system fact value in this row differs from the reference.');
    });

    it('should set tooltip obfuscated', () => {
        const data = { name: 'system1', state: 'INCOMPLETE_DATA_OBFUSCATED' };
        helpers.setTooltip(data, stateFiltersFixtures.allStatesTrue);
        expect(data.tooltip).toEqual('Incomplete data - At least one system fact value in this row is redacted.');
    });

    it('should return full category when filtered by full category name', () => {
        const data = compareReducerPayloadWithCategory.facts;
        const stateFilters = stateFiltersFixtures.allStatesTrue;
        const factFilter = 'cpu_flags';
        const referenceId = undefined;
        const activeFactFilters = [];

        expect(
            helpers.filterCompareData(data, stateFilters, factFilter, referenceId, activeFactFilters)
        ).toEqual(filteredCategory);
    });

    it('should return full category with full category name in active filter', () => {
        const data = compareReducerPayloadWithCategory.facts;
        const stateFilters = stateFiltersFixtures.allStatesTrue;
        const factFilter = '';
        const referenceId = undefined;
        const activeFactFilters = [ 'cpu_flags' ];

        expect(
            helpers.filterCompareData(data, stateFilters, factFilter, referenceId, activeFactFilters)
        ).toEqual(filteredCategory);
    });

    it('should return full category with full category name in active filter and separate filter', () => {
        const data = compareReducerPayloadWithCategory.facts;
        const stateFilters = stateFiltersFixtures.allStatesTrue;
        const factFilter = 'bios';
        const referenceId = undefined;
        const activeFactFilters = [ 'cpu_flags' ];

        expect(
            helpers.filterCompareData(data, stateFilters, factFilter, referenceId, activeFactFilters)
        ).toEqual(filteredCategoryAndFact);
    });

    it('should return uppercase fact name with lowercase fact filter', () => {
        const data = compareReducerPayloadWithUppercase.facts;
        const stateFilters = stateFiltersFixtures.allStatesTrue;
        const factFilter = 'cpus';
        const referenceId = undefined;
        const activeFactFilters = [];

        expect(
            helpers.filterCompareData(data, stateFilters, factFilter, referenceId, activeFactFilters)
        ).toEqual(filteredUpperCaseFact);
    });

    it('should filterComparisons with multivalues with all states true', () => {
        const comparisons = comparisonsWithMultivalues;
        const stateFilters = stateFiltersFixtures.allStatesTrue;
        const factFilter = '';
        const referenceId = undefined;
        const activeFactFilters = [];

        expect(
            helpers.filterComparisons(comparisons, stateFilters, factFilter, referenceId, activeFactFilters)
        ).toEqual(comparisonsWithMultivaluesTooltips);
    });

    it('should filterCompareData with upper case sub fact', () => {
        const data = compareReducerPayloadWithUpperCaseSubFact.facts;
        const stateFilters = stateFiltersFixtures.allStatesTrue;
        const factFilter = 'abm';
        const referenceId = undefined;
        const activeFactFilters = [];

        expect(
            helpers.filterCompareData(data, stateFilters, factFilter, referenceId, activeFactFilters)
        ).toEqual(filteredUpperCaseSubFact);
    });

    it('should filterCompareData with upper case activeFactFilter', () => {
        const data = compareReducerPayloadWithUppercase.facts;
        const stateFilters = stateFiltersFixtures.allStatesTrue;
        const factFilter = '';
        const referenceId = undefined;
        const activeFactFilters = [ 'CPU' ];

        expect(
            helpers.filterCompareData(data, stateFilters, factFilter, referenceId, activeFactFilters)
        ).toEqual(filteredUpperCaseFact);
    });

    it('should filterMultiFacts with all states true', () => {
        const multivalueItems = multivalues;
        const stateFilters = stateFiltersFixtures.allStatesTrue;
        const referenceId = undefined;

        expect(
            helpers.filterMultiFacts(multivalueItems, stateFilters, referenceId)
        ).toEqual(multivaluesWithTooltips);
    });

    it('should return true if fact is in activeFactFilters', () => {
        const fact = 'baltic_porter';
        const factFilter = '';
        const activeFactFilters = [ 'baltic' ];

        expect(
            helpers.filterFact(fact, factFilter, activeFactFilters)
        ).toEqual(true);
    });

    it('should return false if fact is not in activeFactFilters', () => {
        const fact = 'baltic_porter';
        const factFilter = '';
        const activeFactFilters = [ 'ipa', 'stout' ];

        expect(
            helpers.filterFact(fact, factFilter, activeFactFilters)
        ).toEqual(false);
    });

    it('should return true if activeFactFilters is empty and no fact filter', () => {
        const fact = 'baltic_porter';
        const factFilter = '';
        const activeFactFilters = [];

        expect(
            helpers.filterFact(fact, factFilter, activeFactFilters)
        ).toEqual(true);
    });

    it('should return false if activeFactFilters is empty and fact filter doesnt match', () => {
        const fact = 'saison';
        const factFilter = 'gose';
        const activeFactFilters = [];

        expect(
            helpers.filterFact(fact, factFilter, activeFactFilters)
        ).toEqual(false);
    });

    it('should return true if no match in activeFactFilters, fact filter does match', () => {
        const fact = 'lager';
        const factFilter = 'lag';
        const activeFactFilters = [ 'pilsner', 'imperial_stout', 'amber_ale' ];

        expect(
            helpers.filterFact(fact, factFilter, activeFactFilters)
        ).toEqual(true);
    });

    it('should sort data with multifacts ASC, DESC', () => {
        const filteredFacts = compareReducerPayloadWithMultiFact.facts;
        const factSort = 'asc';
        const stateSort = 'desc';

        expect(
            helpers.sortData(filteredFacts, factSort, stateSort)
        ).toEqual(sortedPayloadWithMultiFactAscDesc);
    });

    it('should sort data with multifacts ASC, ASC', () => {
        const filteredFacts = compareReducerPayloadWithMultiFact.facts;
        const factSort = 'asc';
        const stateSort = 'asc';

        expect(
            helpers.sortData(filteredFacts, factSort, stateSort)
        ).toEqual(sortedPayloadWithMultiFactAscAsc);
    });

    it('should convertFactsToCSV', () => {
        let data = compareReducerPayloadWithCategory.facts;
        let referenceId = '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9';
        let systems = compareReducerPayloadWithCategory.systems;

        expect(
            helpers.convertFactsToCSV(data, referenceId, systems)
        ).toEqual(comparisonCSV);
    });

    it('should convertFactsToJSON', () => {
        let data = compareReducerPayloadWithCategory.facts;
        let referenceId = '9c79efcc-8f9a-47c7-b0f2-142ff52e89e9';
        let systems = compareReducerPayloadWithCategory.systems;

        expect(
            helpers.convertFactsToJSON(data, referenceId, systems)
        ).toEqual(comparisonJSON);
    });
});
/*eslint-enable camelcase*/
