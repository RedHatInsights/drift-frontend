import baselinesReducerHelpers from '../helpers';
import fixtures from './baselinesTableReducer.fixtures';

describe('baselines table helpers', () => {
    it('calls fetchBaselines', () => {
        const fetchBaselines = jest.fn();
        baselinesReducerHelpers.fetchBaselines('CHECKBOX', fetchBaselines, {});

        expect(fetchBaselines).toHaveBeenCalled();
    });

    /*eslint-disable camelcase*/
    it('calls fetchBaselines with params', () => {
        const fetchBaselines = jest.fn();
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

        baselinesReducerHelpers.fetchBaselines('CHECKBOX', fetchBaselines, fetchParams);

        expect(fetchBaselines).toHaveBeenCalledWith('CHECKBOX', params);
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
