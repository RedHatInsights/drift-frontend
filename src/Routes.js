import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import asyncComponent from './Utilities/asyncComponent';
import axios from 'axios';
import AsynComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { ErrorState } from '@redhat-cloud-services/frontend-components';

const DriftPage = asyncComponent(() => import ('./SmartComponents/DriftPage/DriftPage'));
const BaselinesPage = asyncComponent(() => import ('./SmartComponents/BaselinesPage/BaselinesPage'));
const EditBaselinePage = asyncComponent(() => import ('./SmartComponents/BaselinesPage/EditBaselinePage/EditBaselinePage'));

const InsightsRoute = ({ component: Component, title, ...rest }) => {
    title ? document.title = title : null;
    const INVENTORY_TOTAL_FETCH_URL = '/api/inventory/v1/hosts';
    const [ hasSystems, setHasSystems ] = useState(false);
    useEffect(() => {
        try {
            axios
            .get(`${INVENTORY_TOTAL_FETCH_URL}?page=1&per_page=1`)
            .then(({ data }) => {
                setHasSystems(data.total > 0);
            });
        } catch (e) {
            console.log(e);
        }
    }, [ hasSystems ]);

    return (
        !hasSystems ?
            <AsynComponent
                appName="dashboard"
                module="./AppZeroState"
                scope="dashboard"
                ErrorComponent={ <ErrorState /> }
                app="Drift"
            />
            : <Route { ...rest } component={ Component } />);
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
