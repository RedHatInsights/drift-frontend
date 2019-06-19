import { addSystemModalReducer } from '../addSystemModalReducer';
import types from '../types';

describe('add system modal reducer', () => {
    it('should return initial state', () => {
        expect(addSystemModalReducer(undefined, {})).toEqual({
            addSystemModalOpened: false,
            activeTab: 0 }
        );
    });

    it('should handle OPEN_ADD_SYSTEM_MODAL true', () => {
        expect(
            addSystemModalReducer({ addSystemModalOpened: false }, {
                type: `${types.OPEN_ADD_SYSTEM_MODAL}`
            })
        ).toEqual({
            addSystemModalOpened: true }
        );
    });

    it('should handle OPEN_ADD_SYSTEM_MODAL false', () => {
        expect(
            addSystemModalReducer({ addSystemModalOpened: true }, {
                type: `${types.OPEN_ADD_SYSTEM_MODAL}`
            })
        ).toEqual({
            addSystemModalOpened: false }
        );
    });

    it('should handle SELECT_ACTIVE_TAB 1', () => {
        expect(
            addSystemModalReducer({ activeTab: 0 }, {
                type: `${types.SELECT_ACTIVE_TAB}`,
                payload: 1
            })
        ).toEqual({
            activeTab: 1 }
        );
    });

    it('should handle SELECT_ACTIVE_TAB 0', () => {
        expect(
            addSystemModalReducer({ activeTab: 1 }, {
                type: `${types.SELECT_ACTIVE_TAB}`,
                payload: 0
            })
        ).toEqual({
            activeTab: 0 }
        );
    });
});
