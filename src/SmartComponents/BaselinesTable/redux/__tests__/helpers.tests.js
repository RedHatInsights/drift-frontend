import baselinesReducerHelpers from '../helpers';
import fixtures from './baselinesTableReducer.fixtures';

describe('baselines table helpers', () => {
    /*eslint-disable camelcase*/
    it('returns empty object in returnParams', () => {
        const params = {
            limit: undefined,
            offset: NaN,
            order_by: undefined,
            order_how: undefined
        };

        expect(baselinesReducerHelpers.returnParams({})).toEqual(params);
    });

    it('returns correct params in returnParams', () => {
        const fetchParams = {
            orderBy: 'display_name',
            orderHow: 'ASC',
            search: 'something'
        };
        const params = {
            order_by: 'display_name',
            order_how: 'ASC',
            display_name: 'something',
            limit: undefined,
            offset: NaN
        };

        expect(baselinesReducerHelpers.returnParams(fetchParams)).toEqual(params);
    });

    it('converts baseline list to csv', () => {
        let data = fixtures.baselineTableDataRows;
        let csv = fixtures.tableDataCSV;
        expect(baselinesReducerHelpers.convertListToCSV(data)).toEqual(csv);
    });

    it('converts baseline list to json', () => {
        let data = fixtures.baselineTableDataRows;
        let json = fixtures.tableDataJSON;
        expect(baselinesReducerHelpers.convertListToJSON(data)).toEqual(JSON.stringify(json));
    });
    /*eslint-enable camelcase*/
});
