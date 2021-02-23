import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Radio } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import moment from 'moment';

export class HistoricalProfilesRadio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: this.findChecked()
        };
    }

    componentDidUpdate(prevProps) {
        const { profile, selectedHSPIds } = this.props;

        if (prevProps.selectedHSPIds !== selectedHSPIds) {
            this.setState({
                checked: selectedHSPIds.includes(profile.id)
            });
        }
    }

    findChecked = () => {
        const { profile, selectedHSPIds, entities } = this.props;
        let checked;

        if (profile.captured_date === 'Latest') {
            checked = entities.selectedSystemIds.some(id => id === profile.id);
        } else {
            checked = selectedHSPIds.some(id => id === profile.id);
        }

        return checked;
    }

    handleChange = () => {
        const { checked } = this.state;
        const { onSingleSelect, profile } = this.props;

        if (!checked) {
            this.setState({
                checked: true
            });
        }

        onSingleSelect(profile);
    }

    render() {
        const { profile } = this.props;
        const { checked } = this.state;

        /*eslint-disable camelcase*/
        return (
            <React.Fragment>
                <Radio
                    isChecked={ checked }
                    id={ profile.captured_date }
                    name={ profile.captured_date }
                    label={ moment.utc(profile.captured_date).format('DD MMM YYYY, HH:mm UTC') }
                    value={ profile.captured_date }
                    onChange={ this.handleChange }
                />
            </React.Fragment>
        );
        /*eslint-enable camelcase*/
    }
}

HistoricalProfilesRadio.propTypes = {
    profile: PropTypes.object,
    selectedHSPIds: PropTypes.array,
    entities: PropTypes.object,
    onSingleSelect: PropTypes.func,
    checked: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        entities: state.entities
    };
}

export default (connect(mapStateToProps, null)(HistoricalProfilesRadio));
