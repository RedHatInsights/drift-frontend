import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import asyncComponent from './Utilities/asyncComponent';

const DriftPage = asyncComponent(() => import ('./SmartComponents/DriftPage/DriftPage'));
const BaselinesPage = asyncComponent(() => import ('./SmartComponents/BaselinesPage/BaselinesPage'));
const EditBaselinePage = asyncComponent(() => import ('./SmartComponents/BaselinesPage/EditBaselinePage/EditBaselinePage'));

const InsightsRoute = ({ component: Component, title, ...rest }) => {
    title ? document.title = title : null;

    return (<Route { ...rest } component={ Component } />);
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
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
            <InsightsRoute path='/baselines/:id' component={ EditBaselinePage } />
            <InsightsRoute
                exact path='/'
                component={ DriftPage }
                title='Comparison - Drift | Red Hat Insights'
            />
            <Redirect to='/'/>
        </Switch>
    );
};
