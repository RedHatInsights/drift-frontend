import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@red-hat-insights/insights-frontend-components';
import { Card, CardBody, Grid, GridItem } from '@patternfly/react-core';

import DriftTable from './DriftTable/DriftTable';
import FilterDropDown from './FilterDropDown/FilterDropDown';
import SearchBar from './SearchBar/SearchBar';
import ExportButton from './ExportButton/ExportButton';

class DriftPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { systems, loading } = this.props;

        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='System Comparison'/>
                </PageHeader>
                <Main>
                    <Card className='pf-t-light pf-m-opaque-100'>
                        <CardBody>
                            { systems.length > 0 && !loading ?
                                <Grid className='drift-toolbar'>
                                    <GridItem span={ 4 }>
                                        <SearchBar />
                                    </GridItem>
                                    <GridItem span={ 2 }>
                                        <FilterDropDown />
                                    </GridItem>
                                    <GridItem span={ 5 }>
                                    </GridItem>
                                    <GridItem span={ 1 }>
                                        <ExportButton />
                                    </GridItem>
                                </Grid>
                                : null
                            }
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

DriftPage.propTypes = {
    loading: PropTypes.bool,
    systems: PropTypes.array
};

function mapStateToProps(state) {
    return {
        loading: state.compareReducer.loading,
        systems: state.compareReducer.systems
    };
}

export default withRouter(connect(mapStateToProps, null)(DriftPage));
