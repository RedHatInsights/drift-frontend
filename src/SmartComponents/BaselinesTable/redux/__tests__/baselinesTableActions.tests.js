import { baselinesTableActions } from '../index';

describe('baselines table actions', () => {
    it('fetchBaselines', () => {
        const promise = new Promise(() => {});

        expect(baselinesTableActions.fetchBaselines('CHECKBOX')).toEqual({
            type: `FETCH_BASELINE_LIST_CHECKBOX`,
            payload: promise
        });
    });

    it('selectBaseline equals', () => {
        expect(baselinesTableActions.selectBaseline([ '1', '2' ], true, 'CHECKBOX')).toEqual({
            type: `SELECT_BASELINE_CHECKBOX`,
            payload: {
                ids: [ '1', '2' ],
                isSelected: true
            }
        });
    });

    it('setSelectedBaselines without ids', () => {
        expect(baselinesTableActions.setSelectedBaselines([], 'CHECKBOX')).toEqual({
            type: `SET_SELECTED_BASELINES_CHECKBOX`,
            payload: []
        });
    });

    it('setSelectedBaselines with ids', () => {
        expect(baselinesTableActions.setSelectedBaselines([ 'abc', '123' ], 'CHECKBOX')).toEqual({
            type: `SET_SELECTED_BASELINES_CHECKBOX`,
            payload: [ 'abc', '123' ]
        });
    });
});
