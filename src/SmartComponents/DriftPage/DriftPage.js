import React, { Component } from 'react';
import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Card, CardBody } from '@patternfly/react-core';

import DriftTable from './DriftTable/DriftTable';
import FilterDropDown from './FilterDropDown/FilterDropDown';

class DriftPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='System Comparison'/>
                </PageHeader>
                <Main className="drift">
                    <Card className='pf-t-light  pf-m-opaque-100'>
                        <CardBody>
                            <div className="drift-toolbar">
                                <FilterDropDown />
                            </div>
                            <div>
                                <DriftTable />
                            </div>
                        </CardBody>
                    </Card>
                </Main>
            </React.Fragment>
        );
    }
}

export default DriftPage;
