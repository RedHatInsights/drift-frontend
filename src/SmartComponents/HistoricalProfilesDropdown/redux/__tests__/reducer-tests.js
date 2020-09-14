import { historicProfilesReducer } from '../reducers';

describe('historical profiles reducer', () => {
    it('should return initial state', () => {
        expect(historicProfilesReducer(undefined, {})).toEqual(
            {
                selectedHSPIds: []
            }
        );
    });

    it('should select historical profile', () => {
        expect(historicProfilesReducer({
            selectedHSPIds: []
        }, {
            type: `SELECT_HISTORIC_PROFILES`,
            payload: [ 'abcd-1234' ]
        })).toEqual(
            {
                selectedHSPIds: [ 'abcd-1234' ]
            }
        );
    });

    it('should select multiple historical profiles', () => {
        expect(historicProfilesReducer({
            selectedHSPIds: []
        }, {
            type: `SELECT_HISTORIC_PROFILES`,
            payload: [ 'abcd-1234', 'efgh-5678' ]
        })).toEqual(
            {
                selectedHSPIds: [ 'abcd-1234', 'efgh-5678' ]
            }
        );
    });

    it('should deselect historical profile', () => {
        expect(historicProfilesReducer({
            selectedHSPIds: [ 'abcd-1234' ]
        }, {
            type: `SELECT_HISTORIC_PROFILES`,
            payload: [ 'efgh-5678' ]
        })).toEqual(
            {
                selectedHSPIds: [ 'efgh-5678' ]
            }
        );
    });

    it('should have no HSPs selected', () => {
        expect(historicProfilesReducer({
            selectedHSPIds: [ 'abcd-1234' ]
        }, {
            type: `SELECT_ENTITY`,
            payload: { id: 0, selected: false }
        })).toEqual(
            {
                selectedHSPIds: []
            }
        );
    });

    it('should have HSPs remain selected with id and selected true', () => {
        expect(historicProfilesReducer({
            selectedHSPIds: [ 'abcd-1234' ]
        }, {
            type: `SELECT_ENTITY`,
            payload: { id: 'nvas-1234-1lnv-134n', selected: true }
        })).toEqual(
            {
                selectedHSPIds: [ 'abcd-1234' ]
            }
        );
    });

    it('should have HSPs remain selected with id and selected false', () => {
        expect(historicProfilesReducer({
            selectedHSPIds: [ 'abcd-1234' ]
        }, {
            type: `SELECT_ENTITY`,
            payload: { id: 'nvas-1234-1lnv-134n', selected: false }
        })).toEqual(
            {
                selectedHSPIds: [ 'abcd-1234' ]
            }
        );
    });

    it('should have HSPs remain selected with no id and selected true', () => {
        expect(historicProfilesReducer({
            selectedHSPIds: [ 'abcd-1234' ]
        }, {
            type: `SELECT_ENTITY`,
            payload: { id: 0, selected: true }
        })).toEqual(
            {
                selectedHSPIds: [ 'abcd-1234' ]
            }
        );
    });

    it('should clear selected HSPs on CLEAR_COMPARISON', () => {
        expect(historicProfilesReducer({
            selectedHSPIds: [ 'abcd-1234' ]
        }, {
            type: `CLEAR_COMPARISON`
        })).toEqual(
            {
                selectedHSPIds: []
            }
        );
    });
});
