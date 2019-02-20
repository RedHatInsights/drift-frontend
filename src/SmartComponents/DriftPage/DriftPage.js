import React, { Component } from 'react';
import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Card, CardBody, Grid, GridItem } from '@patternfly/react-core';

import DriftTable from './DriftTable/DriftTable';
import FilterDropDown from './FilterDropDown/FilterDropDown';
import SearchBar from './SearchBar/SearchBar';

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
                    <Card className='pf-t-light pf-m-opaque-100'>
                        <CardBody>
                            <Grid className='drift-toolbar'>
                                <GridItem span={ 3 }>
                                    <FilterDropDown />
                                </GridItem>
                                <GridItem span={ 9 }>
                                    <SearchBar />
                                </GridItem>
                            </Grid>
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
