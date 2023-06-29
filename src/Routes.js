import { Navigate, Route, Routes } from 'react-router-dom';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import asyncComponent from './Utilities/asyncComponent';
import axios from 'axios';
import AsynComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { ErrorState } from '@redhat-cloud-services/frontend-components';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

const DriftPage = asyncComponent(() => import ('./SmartComponents/DriftPage/DriftPage'));
const BaselinesPage = asyncComponent(() => import ('./SmartComponents/BaselinesPage/BaselinesPage'));
const EditBaselinePage = asyncComponent(() => import ('./SmartComponents/BaselinesPage/EditBaselinePage/EditBaselinePage'));

const InsightsElement = ({ element: Element, title }) => {
    const INVENTORY_TOTAL_FETCH_URL = '/api/inventory/v1/hosts';
    const [ hasSystems, setHasSystems ] = useState(false);
    const chrome = useChrome();
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

    useEffect(()=>{
        title && chrome.updateDocumentTitle(title);
    }, [ chrome, title ]);

    return (
        !hasSystems ?
            <AsynComponent
                appId="drift_zero_state"
                appName="dashboard"
                module="./AppZeroState"
                scope="dashboard"
                ErrorComponent={ <ErrorState /> }
                app="Drift"
            />
            : <Element title={ title } />);
};

InsightsElement.propTypes = {
    element: PropTypes.func,
    title: PropTypes.string
};

const DriftRoutes = () => {
    return (
        <Routes>
            <Route
                path='/baselines'
                element={ <InsightsElement element={ BaselinesPage }
                    title='Baselines - Drift | Red Hat Insights'
                /> }
            />
            <Route path='/baselines/:id'
                element={ <InsightsElement element={ EditBaselinePage } /> }
            />
            <Route
                path='/'
                title='Comparison - Drift | Red Hat Insights'
                element={ <InsightsElement element={ DriftPage }
                    title='Comparison - Drift | Red Hat Insights'
                /> }
            />
            <Route path='*'
                element={ <Navigate to="/" replace /> }
            />
        </Routes>
    );
};

export default DriftRoutes;
