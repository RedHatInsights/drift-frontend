import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';

import asyncComponent from './Utilities/asyncComponent';

const DriftPage = asyncComponent(() => import ('./SmartComponents/DriftPage/DriftPage'));
const BaselinesPage = asyncComponent(() => import ('./SmartComponents/BaselinesPage/BaselinesPage'));
const EditBaseline = asyncComponent(() => import ('./SmartComponents/BaselinesPage/EditBaseline/EditBaseline'));

const InsightsRoute = ({ component: Component, rootClass, title, ...rest }) => {
    title ? document.title = title : null;
    /**
     * @deprecated
     * Mutating chrome root element is deprecated.
     * Please add custom classes on different elements exclusive to vulnerability UI DOM.
     * This functionality will no longer exist in chrome 2 to prevent global styling issues
     */
    const root = document.getElementById('root');
    root.removeAttribute('class');
    /**
     * Adding root class to root element to scope the CSS classes.
     * Chrome 2 will add this class automatically to root element.
     */
    root.classList.add(`page__${rootClass}`, 'pf-l-page__main', 'pf-c-page__main', 'drift');
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
