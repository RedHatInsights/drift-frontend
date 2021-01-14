import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'redux-logger';
import Drift from './AppEntry';

ReactDOM.render(<Drift logger={ logger } />, document.getElementById('root'));
