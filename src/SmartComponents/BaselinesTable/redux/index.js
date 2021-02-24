import { combineReducers } from 'redux';
export { default as baselinesTableActions } from './actions';
import baselinesTableReducer from './baselinesTableReducer';

export const baselinesTableRootReducer = combineReducers({
    checkboxTable: baselinesTableReducer('CHECKBOX'),
    radioTable: baselinesTableReducer('RADIO'),
    comparisonTable: baselinesTableReducer('COMPARISON')
});
