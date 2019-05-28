import addSystemModalReducer from '../addSystemModalReducer';
import types from '../types';

describe('add system modal reducer', () => {
    it('should return initial state', () => {
        expect(addSystemModalReducer.addSystemModalReducer(undefined, {})).toEqual(
            {
                addSystemModalOpened: false
            }
        );
    });

    it('should handle OPEN_ADD_SYSTEM_MODAL true', () => {
        expect(
            addSystemModalReducer.addSystemModalReducer({ addSystemModalOpened: false }, {
                type: `${types.OPEN_ADD_SYSTEM_MODAL}`
            })
        ).toEqual({
            addSystemModalOpened: true
        });
    });

    it('should handle OPEN_ADD_SYSTEM_MODAL false', () => {
        expect(
            addSystemModalReducer.addSystemModalReducer({ addSystemModalOpened: true }, {
                type: `${types.OPEN_ADD_SYSTEM_MODAL}`
            })
        ).toEqual({
            addSystemModalOpened: false
        });
    });
});
