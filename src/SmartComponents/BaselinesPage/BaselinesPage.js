import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Card, CardBody, Toolbar, ToolbarGroup, ToolbarItem } from '@patternfly/react-core';

import BaselinesTable from '../BaselinesTable/BaselinesTable';
import CreateBaselineButton from './CreateBaselineButton/CreateBaselineButton';
import CreateBaseline from './CreateBaseline/CreateBaseline';
import BaselinesKebab from './BaselinesKebab/BaselinesKebab';
import EditBaseline from './EditBaseline/EditBaseline';

class BaselinesPage extends Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await window.insights.chrome.auth.getUser();
    }

    render() {
        const { creatingNewBaseline, baselineUUID, fullBaselineListData } = this.props;

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
                        { baselineUUID !== '' ?
                            <CardBody>
                                <div>
                                    <EditBaseline />
                                </div>
                            </CardBody>
                            : null
                        }
                        { !creatingNewBaseline && baselineUUID === ''
                            ? <CardBody>
                                { fullBaselineListData.length !== 0
                                    ? <Toolbar className="drift-toolbar">
                                        <ToolbarGroup>
                                            <ToolbarItem>
                                                <CreateBaselineButton />
                                            </ToolbarItem>
                                            <ToolbarItem>
                                                <BaselinesKebab exportType='baseline list'/>
                                            </ToolbarItem>
                                        </ToolbarGroup>
                                    </Toolbar>
                                    : null
                                }
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
    creatingNewBaseline: PropTypes.bool,
    baselineUUID: PropTypes.string,
    fullBaselineListData: PropTypes.array
};

function mapStateToProps(state) {
    return {
        creatingNewBaseline: state.baselinesPageState.creatingNewBaseline,
        baselineUUID: state.baselinesTableState.baselineUUID,
        fullBaselineListData: state.baselinesTableState.fullBaselineListData
    };
}

export default connect(mapStateToProps, null)(BaselinesPage);
