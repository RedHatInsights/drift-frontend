import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import asyncComponent from './Utilities/asyncComponent';

const DriftPage = asyncComponent(() => import ('./SmartComponents/DriftPage/DriftPage'));
const BaselinesPage = asyncComponent(() => import ('./SmartComponents/BaselinesPage/BaselinesPage'));

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-l-page__main', 'pf-c-page__main');
    root.setAttribute('role', 'main');

    return (<Route { ...rest } component={ Component } />);
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
    rootClass: PropTypes.string
};

export const Routes = () => {
    return (
        <Switch>
            { window.insights.chrome.isBeta() ?
                <InsightsRoute exact path='/baselines' component={ BaselinesPage } /> : null
            }
            <InsightsRoute exact path='/' component={ DriftPage } />
            <Redirect to='/'/>
        </Switch>
    );
};
