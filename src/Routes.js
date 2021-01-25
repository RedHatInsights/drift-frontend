import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import asyncComponent from './Utilities/asyncComponent';

const DriftPage = asyncComponent(() => import ('./SmartComponents/DriftPage/DriftPage'));
const BaselinesPage = asyncComponent(() => import ('./SmartComponents/BaselinesPage/BaselinesPage'));
const EditBaseline = asyncComponent(() => import ('./SmartComponents/BaselinesPage/EditBaseline/EditBaseline'));

const InsightsRoute = ({ component: Component, rootClass, title, ...rest }) => {
    title ? document.title = title : null;
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-l-page__main', 'pf-c-page__main');
    root.setAttribute('role', 'main');

    return (<Route { ...rest } component={ Component } />);
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
    rootClass: PropTypes.string,
    title: PropTypes.string
};

export const Routes = () => {
    return (
        <Switch>
            <InsightsRoute
                exact path='/baselines'
                component={ BaselinesPage }
                title='Baselines - Drift | Red Hat Insights'
            />
            <InsightsRoute path='/baselines/:id' component={ EditBaseline } />
            <InsightsRoute
                exact path='/'
                component={ DriftPage }
                title='Comparison - Drift | Red Hat Insights'
            />
            <Redirect to='/'/>
        </Switch>
    );
};
