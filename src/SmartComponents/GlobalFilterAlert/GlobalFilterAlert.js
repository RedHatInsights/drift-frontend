import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@patternfly/react-core';

export class GlobalFilterAlert extends Component {
    constructor(props) {
        super(props);
    }

    isFilterSelected = (workloadsFilter) => {
        for (const workload in workloadsFilter) {
            if (workloadsFilter[workload].isSelected) {
                return true;
            }
        }

        return false;
    }

    buildBody = () => {
        const { sidsFilter, tagsFilter, workloadsFilter } = this.props.globalFilterState;
        let filters = '';
        let first = true;

        for (const workload in workloadsFilter) {
            if (workloadsFilter[workload].isSelected) {
                if (!first) {
                    filters = `${ filters }, ${ workload }`;
                } else {
                    filters = `Workloads: ${ workload }`;
                    first = false;
                }
            }
        }

        if (!first) {
            filters += '. ';
        }

        if (sidsFilter.length) {
            filters += 'SAP ID (SID): ';
            for (let i = 0; i < sidsFilter.length; i++) {
                filters += sidsFilter[i];
                if (i + 1 === sidsFilter.length) {
                    filters += '. ';
                } else {
                    filters += ', ';
                }
            }
        }

        if (tagsFilter.length) {
            let tags = [];
            let tagsList = {};
            filters += 'Tags: ';

            tagsFilter.forEach(function(tag) {
                tags.push(tag.split('/'));
            });

            tags.forEach(function(tag) {
                if (!(tag[0] in tagsList)) {
                    tagsList[tag[0]] = [ tag[1] ];
                } else {
                    tagsList[tag[0]].push(tag[1]);
                }
            });

            for (const [ key, value ] of Object.entries(tagsList)) {
                filters += key + ': ';
                for (let i = 0; i < value.length; i++) {
                    filters += value[i];
                    if (i + 1 === value.length) {
                        filters += '. ';
                    } else {
                        filters += ', ';
                    }
                }
            }
        }

        return filters;
    }

    render() {
        const { sidsFilter, tagsFilter, workloadsFilter } = this.props.globalFilterState;

        return (
            <React.Fragment>
                { this.isFilterSelected(workloadsFilter) || sidsFilter.length > 0 || tagsFilter.length > 0
                    ? <Alert
                        variant='info'
                        title='Your systems are pre-filtered by the global context selector.'
                        isInline
                    >
                        <p>
                            { this.buildBody() }
                        </p>
                    </Alert>
                    : null
                }
            </React.Fragment>
        );
    }
}

GlobalFilterAlert.propTypes = {
    globalFilterState: PropTypes.object
};

export default GlobalFilterAlert;
