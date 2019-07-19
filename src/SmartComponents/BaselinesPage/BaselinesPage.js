import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Card, CardBody, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';

import BaselinesTable from '../BaselinesTable/BaselinesTable';
import CreateBaselineButton from './CreateBaselineButton/CreateBaselineButton';
import CreateBaseline from './CreateBaseline/CreateBaseline';
import EditBaseline from './EditBaseline/EditBaseline';
import { baselinesTableActions } from '../BaselinesTable/redux';

class BaselinesPage extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
    }

    render() {
        const { fetchBaselines, creatingNewBaseline, baselineData } = this.props;

        fetchBaselines();

        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='Baselines'/>
                </PageHeader>
                <Main>
                    <Card className='pf-t-light pf-m-opaque-100'>
                        { creatingNewBaseline
                            ? <CardBody>
                                <div>
                                    <CreateBaseline />
                                </div>
                            </CardBody>
                            : null
                        }
                        { baselineData ?
                            <CardBody>
                                <div>
                                    <EditBaseline />
                                </div>
                            </CardBody>
                            : null
                        }
                        { !creatingNewBaseline && !baselineData
                            ? <CardBody>
                                <Toolbar className="drift-toolbar">
                                    <ToolbarGroup>
                                        <ToolbarItem>
                                            <CreateBaselineButton />
                                        </ToolbarItem>
                                    </ToolbarGroup>
                                </Toolbar>
                                <div>
                                    <BaselinesTable />
                                </div>
                            </CardBody>
                            : null
                        }
                    </Card>
                </Main>
            </React.Fragment>
        );
    }
}

BaselinesPage.propTypes = {
    fetchBaselines: PropTypes.func,
    creatingNewBaseline: PropTypes.bool,
    baselineData: PropTypes.obj
};

function mapStateToProps(state) {
    return {
        creatingNewBaseline: state.baselinesPageState.creatingNewBaseline,
        baselineData: state.baselinesTableState.baselineData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchBaselines: () => dispatch(baselinesTableActions.fetchBaselines())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BaselinesPage);
