import baselinesReducerHelpers from '../helpers';

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
    /*eslint-enable camelcase*/
});
