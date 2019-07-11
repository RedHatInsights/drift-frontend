import types from '../types';
import { baselinesTableActions } from '../index';

describe('baselines table actions', () => {
    it('fetchBaselines', () => {
        const promise = new Promise(() => {});

        expect(baselinesTableActions.fetchBaselines()).toEqual({
            type: types.FETCH_BASELINE_LIST,
            payload: promise
        });
    });

    it('selectBaseline equals', () => {
        let rows = [
            [ 'arch baseline', '2019-07-10T19:48:29.125065Z' ],
            [ 'cpu + mem baseline', '2019-07-10T19:48:29.130082Z' ]
        ];

        rows[0].selected = true;

        expect(baselinesTableActions.selectBaseline(rows)).toEqual({
            type: types.SELECT_BASELINE,
            payload: rows
        });
    });

    it('selectBaseline not correct', () => {
        let rows = [
            [ 'arch baseline', '2019-07-10T19:48:29.125065Z' ],
            [ 'cpu + mem baseline', '2019-07-10T19:48:29.130082Z' ]
        ];

        let incorrectRows = rows;

        incorrectRows[0].selected = true;

        expect(baselinesTableActions.selectBaseline(incorrectRows)).not.toBe({
            type: types.SELECT_BASELINE,
            payload: rows
        });
    });
});
